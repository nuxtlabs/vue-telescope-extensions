const browser = require('webextension-polyfill')

// injecting the script

const content = browser.extension.getURL('injected.js')
const script = document.createElement('script')
script.setAttribute('defer', 'defer')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', content)
// document.body.appendChild(script)
document.documentElement.appendChild(script)
script.parentNode.removeChild(script)

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
