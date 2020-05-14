browser.runtime.onMessage.addListener((_) => {
  detectVue()
  return Promise.resolve({ response: document.querySelectorAll('*') })
})

function detectVue () {
  return window.Vue || window.$nuxt || [...document.querySelectorAll('*')].map((el) => Boolean(el.__vue__)).filter(Boolean).length
}
