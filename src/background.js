const browser = require('webextension-polyfill')

const tabsStorage = {}

browser.tabs.onActivated.addListener(handleActivated)
browser.tabs.onUpdated.addListener(handleUpdated)

browser.runtime.onMessage.addListener(
  async function (message, sender, sendResponse) {
    // console.log('onMessage message', message)
    // console.log('onMessage sender', sender)
    // console.log('onMessage tabId', sender.tab.id)
    if (message.action === 'analyzeLocally') {
      tabsStorage[sender.tab.id] = {}
      tabsStorage[sender.tab.id] = message.payload

      browser.browserAction.setIcon({
        tabId: sender.tab.id,
        path: message.payload.hasVue ? 'icons/icon-128.png' : 'icons/icon-grey-128.png'
      })
      if (message.payload.hasVue) {
        const res = await fetch(`https://vuetelemetry.com/api/analyze?url=${message.payload.url}`, {
          method: 'GET'
        })
          .then((response) => {
            return response.json()
          })
          .catch((err) => {
            throw new Error(err)
          })
        tabsStorage[sender.tab.id].isPublic = res.body.isPublic
        tabsStorage[sender.tab.id].slug = res.body.slug
      }
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
    tabsStorage[tabId].url = tabInfo.url
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   // send message to content script
    //   chrome.tabs.sendMessage(tabs[0].id, { from: 'background', proxyTo: 'injected', payload: { message: 'hello from background with sendMessage' } })
    // })
    console.log('tabsStorage', tabsStorage)
  }
}
