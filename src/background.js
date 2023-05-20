import { IS_CHROME, IS_FIREFOX, isSupportExecutionVersion } from './utils'
const browser = require('webextension-polyfill')

// persistent state storage
class TabsStorage {
  constructor () {
    this.key = 'tabs'
  }

  async get () {
    const cache = await browser.storage.local.get([this.key])
    return cache[this.key] || {}
  }

  async set (tabId, state) {
    const cache = await this.get()
    return browser.storage.local.set({ [this.key]: { ...cache, [tabId]: state } })
  }

  async clear () {
    return browser.storage.local.remove([this.key])
  }
}

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
browser.runtime.onStartup.addListener(() => {
  // clear state on startup.
  // note: chrome allows to use 'browser.storage.session' but it is available in chrome only.
  // for firefox a 'window.session' can be considered as alternative.
  // TODO: create polyfill for session store.
  new TabsStorage().clear()
})

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
    const tabsStorage = new TabsStorage()
    if (message.action === 'analyze') {
      // when sending message from popup.js there's no sender.tab, so need to pass tabId
      const tabId = (sender.tab && sender.tab.id) || message.payload.tabId
      setIcon({
        tabId: tabId,
        path: message.payload.hasVue ? 'icons/icon-128.png' : 'icons/icon-grey-128.png'
      })

      const tabs = await tabsStorage.get()
      if (!tabs[tabId]) {
        tabs[tabId] = message.payload
      } else {
        // temporary fix when hit CSP
        if (!message.payload.modules.length) delete message.payload.modules
        if (!message.payload.plugins.length) delete message.payload.plugins

        tabs[tabId] = { ...tabs[tabId], ...message.payload }
      }

      const showcase = tabs[tabId]
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
      tabsStorage.set(tabId, tabs[tabId])
    } else if (!sender.tab) {
      if (message.action === 'getShowcase') {
        const tabs = await tabsStorage.get()
        return { payload: tabs[message.payload.tabId] }
      }
    }
  }
)

// when tab clicked
async function handleActivated ({ tabId, windowId }) {
  const tabsStorage = new TabsStorage()
  const tabs = await tabsStorage.get()
  setIcon({
    tabId,
    path: tabs[tabId] && tabs[tabId].hasVue ? 'icons/icon-128.png' : 'icons/icon-grey-128.png'
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
    const tabsStorage = new TabsStorage()
    const tabs = await tabsStorage.get()
    if (!tabs[tabId]) return
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
