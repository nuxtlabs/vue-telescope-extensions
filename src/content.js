import { IS_CHROME, isSupportExecutionVersion } from '../scripts/utils'
const browser = require('webextension-polyfill')

// injecting the script
function injectScript(src) {
  const script = document.createElement('script')
  script.setAttribute('defer', 'defer')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', src)
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}

// equivalent logic for other browser is in background.js
if (!IS_CHROME || !isSupportExecutionVersion)
  injectScript(browser.runtime.getURL('injected.js'))

// content script logic
browser.runtime.onMessage.addListener(messageFromBackground)

function messageFromBackground(message) {
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
