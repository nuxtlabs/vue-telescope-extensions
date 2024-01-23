import { IS_FIREFOX, isForbiddenUrl } from '~/env'

// Firefox fetch files from cache instead of reloading changes from disk,
// hmr will not work as Chromium based browser
browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
  // Filter out non main window events.
  if (frameId !== 0)
    return

  if (isForbiddenUrl(url))
    return

  // browser.tabs.executeScript(tabId, {
  //   file: `${IS_FIREFOX ? '' : '.'}/dist/contentScripts/injected.global.js`,
  //   runAt: 'document_start',
  // }).catch(error => console.error(error))

  // inject the latest scripts
  browser.tabs.executeScript(tabId, {
    file: `${IS_FIREFOX ? '' : '.'}/dist/contentScripts/index.global.js`,
    runAt: 'document_end',
  }).catch(error => console.error(error))
})