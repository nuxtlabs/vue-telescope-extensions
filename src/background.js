import { IS_CHROME, IS_FIREFOX, isSupportExecutionVersion } from './utils'
const browser = require('webextension-polyfill')

const tabsStorage = {}

if (IS_CHROME && isSupportExecutionVersion) {
  /**
   *  equivalent logic for Firefox is in content.js
   *  Manifest V3 method of injecting content scripts (not yet supported in Firefox)
      Note: the "world" option in registerContentScripts is only available in Chrome v102+
      MAIN The execution environment of the web page. This environment is shared with the web page, without isolation.
   */
  browser.scripting.registerContentScripts(
    [
      {
        id: 'injected',
        matches: ['<all_urls>'],
        js: ['injected.js'],
        runAt: 'document_start',
        world: browser.scripting.ExecutionWorld.MAIN
      }
    ],
    function () {
    // When the content scripts are already registered, an error will be thrown.
    // It happens when the service worker process is incorrectly duplicated.
      if (browser.runtime.lastError) {
        console.error(browser.runtime.lastError)
      }
    }
  )
}

browser.tabs.onActivated.addListener(handleActivated)
browser.tabs.onUpdated.addListener(handleUpdated)

function setIcon (details) {
  // because manifest version is different
  if (IS_FIREFOX) {
    browser.browserAction.setIcon(details)
  } else {
    browser.action.setIcon(details)
  }
}

browser.runtime.onMessage.addListener(
  async function (message, sender, sendResponse) {
    if (message.action === 'analyze') {
      // when sending message from popup.js there's no sender.tab, so need to pass tabId
      const tabId = (sender.tab && sender.tab.id) || message.payload.tabId
      setIcon({
        tabId: tabId,
        path: message.payload.hasVue ? 'icons/icon-128.png' : 'icons/icon-grey-128.png'
      })

      if (!tabsStorage[tabId]) {
        tabsStorage[tabId] = message.payload
      } else {
        // temporary fix when hit CSP
        if (!message.payload.modules.length) delete message.payload.modules
        if (!message.payload.plugins.length) delete message.payload.plugins

        tabsStorage[tabId] = { ...tabsStorage[tabId], ...message.payload }
      }

      const showcase = tabsStorage[tabId]
      if (showcase.hasVue && !showcase.slug) {
        try {
          if (typeof EventSource === 'undefined') {
            console.log('EventSource is not supported in current borwser!')
            return
          }
          const sse = new EventSource(
          `https://service.vuetelescope.com?url=${message.payload.url}`
          )
          sse.addEventListener('message', (event) => {
            try {
              const res = JSON.parse(event.data)
              if (!res.error && !res.isAdultContent) {
                showcase.isPublic = res.isPublic
                showcase.slug = res.slug
                sse.close()

                // temporary fix when hit CSP
                if (!showcase.modules.length && res.modules.length) {
                  showcase.modules = res.modules
                }
                if (!showcase.plugins.length && res.plugins.length) {
                  showcase.plugins = res.plugins
                }
              } else {
                throw new Error('API call to VT failed')
              }
            } catch (err) {
              sse.close()
            }
          })
        } catch (err) {}
      }
      // tabsStorage[tabId] = message.payload
    } else if (!sender.tab) {
      if (message.action === 'getShowcase') {
        // this is likely popup requesting
        // sendResponse doesn't work in Firefox 👀
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Sending_a_synchronous_response
        return Promise.resolve({ payload: tabsStorage[message.payload.tabId] })
        // sendResponse({ payload: tabsStorage[message.payload.tabId] })
      }
    }
  }
)

// when tab clicked
async function handleActivated ({ tabId, windowId }) {
  setIcon({
    tabId,
    path: tabsStorage[tabId] && tabsStorage[tabId] && tabsStorage[tabId].hasVue ? 'icons/icon-128.png' : 'icons/icon-grey-128.png'
  })
  // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  //   const { id, url, status } = tabs[0]
  //   if (status === 'complete') {
  //     // tabsStorage[id].url = url
  //   }
  // })
}

// when tab updated
async function handleUpdated (tabId, changeInfo, tabInfo) {
  if (changeInfo.status === 'complete') {
    if (!tabsStorage[tabId]) return
    // tabsStorage[tabId].url = tabInfo.url
    browser.tabs.sendMessage(tabId, {
      from: 'background',
      to: 'injected',
      action: 'analyze',
      payload: {}
    })
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   // send message to content script
    //   chrome.tabs.sendMessage(tabs[0].id, { from: 'background', to: 'injected', payload: { message: 'hello from background with sendMessage' } })
    // })
    // console.log('tabsStorage', tabsStorage)
  }
}
