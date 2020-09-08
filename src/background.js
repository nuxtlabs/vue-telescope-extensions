const browser = require('webextension-polyfill')

const tabsStorage = {}

browser.tabs.onActivated.addListener(handleActivated)
browser.tabs.onUpdated.addListener(handleUpdated)

browser.runtime.onMessage.addListener(
  async function (message, sender, sendResponse) {
    if (message.action === 'analyze') {
      // when sending message from popup.js there's no sender.tab, so need to pass tabId
      const tabId = (sender.tab && sender.tab.id) || message.payload.tabId
      browser.browserAction.setIcon({
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
      if (showcase.hasVue) {
        try {
          const res = await fetch(`https://vuetelemetry.com/api/analyze?url=${message.payload.url}`, {
            method: 'GET'
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('API call to VT failed')
              }
              return response.json()
            })
          showcase.isPublic = res.body.isPublic
          showcase.slug = res.body.slug

          // temporary fix when hit CSP
          if (!showcase.modules.length && res.body.modules.length) {
            showcase.modules = res.body.modules
          }
          if (!showcase.plugins.length && res.body.plugins.length) {
            showcase.plugins = res.body.plugins
          }
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
  browser.browserAction.setIcon({
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
