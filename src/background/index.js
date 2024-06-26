import { IS_CHROME, IS_FIREFOX, isSupportExecutionVersion } from '../utils'
import browser from 'webextension-polyfill'
import TabsStateService from './TabsStateService'

const tabsState = new TabsStateService()

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

browser.tabs.onUpdated.addListener(handleUpdated)
browser.runtime.onStartup.addListener(() => {
  // clear state on startup.
  // note: chrome allows to use 'browser.storage.session' but it is available in chrome only.
  // for firefox a 'window.session' can be considered as alternative.
  // TODO: create polyfill for session store.
  tabsState.clear()
})

async function setIcon (details) {
  // because manifest version is different
  if (IS_FIREFOX) {
    await browser.browserAction.setIcon(details)
  } else {
    await browser.action.setIcon(details)
  }
}

const setIconForTab = async (tabId) => {
    const tabs = await tabsState.get()
    const tab = tabs[tabId];
    if (tab?.framework?.slug) {
        const slug = tab.framework.slug
        const iconPath = `icons/${slug}.png`
        try {
            await setIcon({tabId, path: iconPath});
        } catch(e) {
            await setIcon({
                tabId,
                path: 'icons/icon-128.png'
              })
        }
    } else {
        await setIcon({
          tabId,
          path: tab?.hasVue ? 'icons/icon-128.png' : 'icons/icon-grey-128.png'
        })
    }
}

browser.storage.local.onChanged.addListener(async (payload) => {
    if (payload.settings) {
        const tabs = await browser.tabs.query({});
        tabs.forEach(tab => {
            if (tab.id) {
                setIconForTab(tab.id)
            }
        })
    }
})

browser.runtime.onMessage.addListener(
  async function (message, sender, sendResponse) {
    if (message.action === 'analyze') {
      // when sending message from popup.js there's no sender.tab, so need to pass tabId
      const tabId = (sender.tab && sender.tab.id) || message.payload.tabId

      const tabs = await tabsState.get()
      // set/overwrite analyzed data on new tab/url
      if (!tabs[tabId] || tabs[tabId].url !== message.payload.url) {
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
          sse.addEventListener('message', async (event) => {
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
                await tabsState.updateData(tabId, tabs[tabId])
              } else {
                throw new Error('API call to VT failed')
              }
            } catch (err) {
              sse.close()
            }
          })
        } catch (err) {}
      }
      await tabsState.updateData(tabId, tabs[tabId])
      await setIconForTab(tabId);
    } else if (!sender.tab) {
      if (message.action === 'getShowcase') {
        const tabs = await tabsState.get()
        return { payload: tabs[message.payload.tabId] }
      }
    }
  }
)

// when tab updated
async function handleUpdated (tabId, changeInfo, tabInfo) {
  if (changeInfo.status === 'complete') {
    const tabs = await tabsState.get()
    if (!tabs[tabId]) return
    // tabsStorage[tabId].url = tabInfo.url
    browser.tabs.sendMessage(tabId, {
      from: 'background',
      to: 'injected',
      action: 'analyze',
      payload: {}
    })
  }
}
