const isBrowser = typeof navigator !== 'undefined'
import { tabs } from "webextension-polyfill"
const isFirefox = isBrowser && navigator.userAgent.indexOf('Firefox') > -1
import "@babel/polyfill";

if (document instanceof HTMLDocument) {
  installScript(detectVue)
}

let resolveDetecting
let detecting = new Promise((resolve) => {
  resolveDetecting = resolve
})
let vueInfo = null
window.addEventListener('message', ({ data }) => {
  if (data.__vue_telemetry__) {
    vueInfo = data
    resolveDetecting()
  }
})

function handleMessage() {
  return new Promise(async (resolve) => {
    await detecting
    resolve({ response: { vueInfo } })
  })
}

tabs.runtime.onMessage.addListener(handleMessage)

function detectVue(win) {

  setTimeout(() => {

    let hasVue = Boolean(window.Vue || window.$nuxt) //|| [...document.querySelectorAll('*')].map((el) => Boolean(el.__vue__)).filter(Boolean).length)

    if (hasVue == false) {
      const all = document.querySelectorAll('*')
      let el
      for (let i = 0; i < all.length; i++) {
        if (all[i].__vue__) {
          el = all[i]
          break
        }
      }
      if (el) {
        hasVue = true;
      }
    }

    win.postMessage({
      __vue_telemetry__: true,
      domain: document.domain,
      hasVue: hasVue
    })


  }, 100)
}

function installScript(fn) {
  const source = ';(' + fn.toString() + ')(window)'

  if (isFirefox) {
    // eslint-disable-next-line no-eval
    window.eval(source) // in Firefox, this evaluates on the content window
  } else {
    const script = document.createElement('script')
    script.setAttribute('defer', 'defer')
    script.textContent = source
    document.documentElement.appendChild(script)
    script.parentNode.removeChild(script)
  }
}
