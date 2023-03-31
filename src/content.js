import { IS_FIREFOX, isSupportExecutionVersion } from './utils'
const browser = require('webextension-polyfill')

// injecting the script, inspire by react-devtools-extensions
function injectScriptSync (src) {
  let code = ''
  const request = new XMLHttpRequest()
  request.addEventListener('load', function () {
    code = this.responseText
  })
  request.open('GET', src, false)
  request.send()
  const script = document.createElement('script')
  script.textContent = code
  // This script runs before the <head> element is created, so we add the script to <html> instead.
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}

// equivalent logic for other browser is in background.js
if (IS_FIREFOX || !isSupportExecutionVersion) {
  injectScriptSync(browser.extension.getURL('injected.js'))
}

// content script logic

browser.runtime.onMessage.addListener(messageFromBackground)

function messageFromBackground (message) {
  if (message.to === 'injected') {
    // proxy message to injected
    postMessage({
      from: 'content',
      proxyFrom: message.from,
      to: message.to,
      action: message.action,
      payload: message.payload || {}
    }, '*')
  }
}

// listen to messages from injected script
window.addEventListener('message', function (event) {
  if (event.data.from === 'injected') {
    if (event.data.action) {
      browser.runtime.sendMessage({
        from: 'content',
        proxyFrom: event.data.from,
        to: event.data.to,
        action: event.data.action,
        payload: event.data.payload
      })
    }
  } else if (event.data.from === 'popup') {
    // console.log('message from popup', event.data)
  } else if (event.data.from !== 'content') {
    // console.log('some other message', event.data)
  }
})
