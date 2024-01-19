import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { IS_CHROME, isSupportExecutionVersion } from '~/env'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // injecting the script
  function injectScript(src: any) {
    const script = document.createElement('script')
    script.setAttribute('defer', 'defer')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', src)
    document.documentElement.appendChild(script)
    script.parentNode?.removeChild(script)
  }

  // equivalent logic for other browser is in background.js
  if (!IS_CHROME || !isSupportExecutionVersion)
    injectScript(browser.runtime.getURL('injected.global.js'))

  // content script logic
  browser.runtime.onMessage.addListener(messageFromBackground)

  function messageFromBackground(message: any) {
    if (message.to === 'injected') {
    // proxy message to injected
      postMessage({
        from: 'content',
        proxyFrom: message.from,
        to: message.to,
        action: message.action,
        payload: message.payload || {},
      }, '*')
    }
  }

  // listen to messages from injected script
  window.addEventListener('message', (event) => {
    if (event.data.from === 'injected') {
      if (event.data.action) {
        browser.runtime.sendMessage({
          from: 'content',
          proxyFrom: event.data.from,
          to: event.data.to,
          action: event.data.action,
          payload: event.data.payload,
        })
      }
    }
    else if (event.data.from === 'popup') {
    // console.log('message from popup', event.data)
    }
    else if (event.data.from !== 'content') {
    // console.log('some other message', event.data)
    }
  })

  // mount component to context window
  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))

  try {
    shadowDOM.appendChild(styleEl)
    shadowDOM.appendChild(root)
    document.body.appendChild(container)
  }
  catch (err: any) {
    // eslint-disable-next-line no-console
    console.log(err)
  }

  const app = createApp(App)
  setupApp(app)
  app.mount(root)
})()
