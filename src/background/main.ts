// import { onMessage, sendMessage } from 'webext-bridge/background'
// import type { Tabs } from 'webextension-polyfill'
import TabsStateService from './TabsStateService'

const tabsState = new TabsStateService()

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

browser.tabs.onUpdated.addListener(handleUpdated)
browser.runtime.onStartup.addListener(() => {
  // clear state on startup.
  // note: chrome allows to use 'browser.storage.session' but it is available in chrome only.
  // for firefox a 'window.session' can be considered as alternative.
  // TODO: create polyfill for session store.
  tabsState.clear()
})

async function setIcon(details: any) {
  // because manifest version is different
  // if (IS_FIREFOX)
  //   await browser.browserAction.setIcon(details)

  // else
  await browser.action.setIcon(details)
}

const setIconForTab = async (tabId: any) => {
  const tabs = await tabsState.get()
  const tab = tabs[tabId]
  if (tab?.framework?.slug) {
    const slug = tab.framework.slug
    const iconPath = `icons/${slug}.png`
    try {
      await setIcon({ tabId, path: iconPath })
    }
    catch (e) {
      await setIcon({
        tabId,
        path: 'icons/icon-128.png',
      })
    }
  }
  else {
    await setIcon({
      tabId,
      path: tab?.hasVue ? 'icons/icon-128.png' : 'icons/icon-grey-128.png',
    })
  }
}

browser.storage.local.onChanged.addListener(async (payload) => {
  if (payload.settings) {
    const tabs = await browser.tabs.query({})
    tabs.forEach((tab) => {
      if (tab.id)
        setIconForTab(tab.id)
    })
  }
})

browser.runtime.onMessage.addListener(
  async (message, sender, _) => {
    if (message.action === 'analyze') {
      // when sending message from popup.js there's no sender.tab, so need to pass tabId
      const tabId = (sender.tab && sender.tab.id) || message.payload.tabId

      const tabs = await tabsState.get()
      if (!tabs[tabId]) {
        tabs[tabId] = message.payload
      }
      else {
        // temporary fix when hit CSP
        if (!message.payload.modules.length)
          delete message.payload.modules
        if (!message.payload.plugins.length)
          delete message.payload.plugins

        tabs[tabId] = { ...tabs[tabId], ...message.payload }
      }

      const showcase = tabs[tabId]
      if (showcase.hasVue && !showcase.slug) {
        try {
          if (typeof EventSource === 'undefined') {
            // console.log('EventSource is not supported in current borwser!')
            return
          }
          const sse = new EventSource(
          `https://service.vuetelescope.com?url=${message.payload.url}`,
          )
          sse.addEventListener('message', async (event) => {
            try {
              const res = JSON.parse(event.data)
              // console.log('res', res)
              if (!res.error && !res.isAdultContent) {
                showcase.isPublic = res.isPublic
                showcase.slug = res.slug
                sse.close()

                // temporary fix when hit CSP
                if (!showcase.modules.length && res.modules.length)
                  showcase.modules = res.modules

                if (!showcase.plugins.length && res.plugins.length)
                  showcase.plugins = res.plugins

                await tabsState.updateData(tabId, tabs[tabId])
              }
              else {
                throw new Error('API call to VT failed')
              }
            }
            catch (err) {
              sse.close()
            }
          })
        }
        catch (err) {}
      }
      await tabsState.updateData(tabId, tabs[tabId])
      await setIconForTab(tabId)
    }
    else if (!sender.tab) {
      if (message.action === 'getShowcase') {
        const tabs = await tabsState.get()
        return { payload: tabs[message.payload.tabId] }
      }
    }
  },
)

// when tab updated
async function handleUpdated(tabId: any, changeInfo: any) {
  if (changeInfo.status === 'complete') {
    const tabs = await tabsState.get()
    if (!tabs[tabId])
      return
    // tabsStorage[tabId].url = tabInfo.url
    browser.tabs.sendMessage(tabId, {
      from: 'background',
      to: 'injected',
      action: 'analyze',
      payload: {},
    })
  }
}

// let previousTabId = 0

// // communication example: send previous tab title from background page
// // see shim.d.ts for type declaration
// browser.tabs.onActivated.addListener(async ({ tabId }) => {
//   if (!previousTabId) {
//     previousTabId = tabId
//     return
//   }

//   let tab: Tabs.Tab

//   try {
//     tab = await browser.tabs.get(previousTabId)
//     previousTabId = tabId
//   }
//   catch {
//     return
//   }

//   // eslint-disable-next-line no-console
//   console.log('previous tab', tab)
//   sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
// })

// onMessage('get-current-tab', async () => {
//   try {
//     const tab = await browser.tabs.get(previousTabId)
//     return {
//       title: tab?.title,
//     }
//   }
//   catch {
//     return {
//       title: undefined,
//     }
//   }
// })
