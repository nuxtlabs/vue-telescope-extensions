const browser = require('webextension-polyfill')
const isBrowser: boolean = typeof navigator !== 'undefined'
const isFirefox: boolean = isBrowser && navigator.userAgent.indexOf('Firefox') > -1

let vueInfo = null
let resolveDetecting: { (): void; (value?: unknown): void; }

const detecting = new Promise((resolve) => {
  resolveDetecting = resolve
})

window.addEventListener('message', ({ data }) => {
  if (data.__vue_telemetry__) {
    vueInfo = data
    resolveDetecting()
  }
})

function handleMessage () {
  return new Promise((resolve) => {
    detecting.then(function () {
      resolve({ response: { vueInfo } })
    })
  })
}

if (document instanceof HTMLDocument) {
  installScript(detectVue)
}

browser.runtime.onMessage.addListener(handleMessage)

function detectVue (win: { postMessage: (arg0: { __vue_telemetry__: boolean; domain: string; hasVue: boolean; }) => void; }) {
  setTimeout(() => {
    let hasVue: boolean = Boolean(window.Vue || (window as any).$nuxt) // || [...document.querySelectorAll('*')].map((el) => Boolean(el.__vue__)).filter(Boolean).length)

    if (hasVue === false) {
      const all = document.querySelectorAll('*')
      let el: Element
      for (let i = 0; i < all.length; i++) {
        if ((all[i] as any).__vue__) {
          el = all[i]
          break
        }
      }
      if (el) {
        hasVue = true
      }
    }

    win.postMessage({
      __vue_telemetry__: true,
      domain: document.domain,
      hasVue
    })
  }, 100)
}

function installScript (fn: { (win: { postMessage: (arg0: { __vue_telemetry__: boolean; domain: string; hasVue: boolean; }) => void; }): void; toString?: any; }) {
  const source = `;(${fn.toString()})(window)`

  if (isFirefox) {
    // eslint-disable-next-line no-eval
    window.eval(source) // in Firefox, this evaluates on the content window
  } else {
    const script: HTMLScriptElement = document.createElement('script')
    script.setAttribute('defer', 'defer')
    script.textContent = source
    document.documentElement.appendChild(script)
    script.parentNode.removeChild(script)
  }
}
