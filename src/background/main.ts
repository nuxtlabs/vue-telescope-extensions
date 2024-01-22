import browser from 'webextension-polyfill'
import TabsStateService from './TabsStateService'
import { IS_CHROME, IS_FIREFOX, isSupportExecutionVersion } from '~/env'

const tabsState = new TabsStateService()

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

const injectScript = async () => {
  await browser.scripting.registerContentScripts(
    [
      {
        id: 'injected',
        matches: ['<all_urls>'],
        js: ['dist/contentScripts/injected.global.js'],
        runAt: 'document_start',
        // @ts-expect-error - not exist on static
        world: 'MAIN',
      },
    ])
}

if (IS_CHROME && isSupportExecutionVersion) {
  // eslint-disable-next-line no-console
  injectScript().catch((err: any) => console.log('err', err))
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

const setIcon = async (details: any) => {
  // because manifest version is different
  if (IS_FIREFOX)
    await browser.browserAction.setIcon(details)

  else
    await browser.action.setIcon(details)
}

const setIconForTab = async (tabId: number) => {
  const tabs = await tabsState.get()
  const tab = tabs[tabId]

  if (tab?.framework?.slug) {
    const slug = tab.framework.slug
    const iconPath = `../../assets/${slug}.png`

    try {
      await setIcon({ tabId, path: iconPath })
    }
    catch (e) {
      await setIcon({
        tabId,
        path: '../../assets/icon-128.png',
      })
    }
  }
  else {
    await setIcon({
      tabId,
      path: tab?.hasVue ? '../../assets/icon-128.png' : '../../assets/icon-grey-128.png',
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
            // eslint-disable-next-line no-console
            console.log('EventSource is not supported in current borwser!')
            return
          }
          const sse = new EventSource(
            `https://service.vuetelescope.com?url=${message.payload.url}`,
          )
          sse.addEventListener('message', async (event) => {
            try {
              const res = JSON.parse(event.data)
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
        catch (err) { }
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

// when tab updated@
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
