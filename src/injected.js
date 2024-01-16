// const browser = require('webextension-polyfill')
import { detectors } from '../node_modules/vue-telescope-analyzer/detectors'
// const detectors = require('vue-telescope-analyzer/src/detectors')

// backward compatibility
window.$vueTelemetryExtension = true
window.$vueTelescopeExtension = true

async function analyze() {
  if (isBlacklisted(document.location.href))
    return
  // const originalHtml = await fetch(document.location.href).then(res => res.text())
  const originalHtml = document.documentElement.outerHTML
  const context = {
    originalHtml,
    html: document.documentElement.outerHTML,
    scripts: Array.from(document.getElementsByTagName('script')).map(({ src }) => src).filter(script => script),
    page: {
      // evaluate: fn => window.eval(`(${fn});`),
    },
  }
  const hasVue = await detectors.hasVue(context)
  const vueVersion = window.$nuxt?.$root?.constructor?.version || window.Vue?.version || [...document.querySelectorAll('*')].map(el => el.__vue__?.$root?.constructor?.version || el.__vue_app__?.version).filter(Boolean)[0]
  const { ssr } = await detectors.getVueMeta(context)
  const framework = await detectors.getFramework(context)
  if (framework?.slug === 'nuxtjs' && vueVersion) {
    try {
      framework.version = window.__unctx__?.get('nuxt-app')?.use()?.versions?.nuxt
    }
    catch (e) {}
    framework.version = framework.version || `Version ${vueVersion.split('.')[0]}`
  }
  const ui = await detectors.getUI(context)
  const plugins = await detectors.getPlugins(context)
  const nuxtMeta = await detectors.getNuxtMeta(context)
  const modules = await detectors.getNuxtModules(context)

  window.postMessage({
    from: 'injected',
    action: 'analyze',
    payload: {
      url: document.location.href,
      path: document.location.pathname || '/',
      hasVue,
      vueVersion,
      // meta,
      plugins,
      framework,
      ui,
      hasSSR: ssr || nuxtMeta.ssr,
      isStatic: nuxtMeta.static,
      modules,
    },
  })
}

analyze()

// listen to messages from content/popup/other script
window.addEventListener('message', (event) => {
  if (event.data && event.data.from === 'content' && event.data.action === 'analyze') {
    analyze()
    // console.log('message from content', event.data)
  }
  else if (event.data && event.data.proxyFrom === 'background' && event.data.action === 'analyze') {
    // console.log('message from background', event.data)
    analyze()
  }
  else if (event.data && event.data.from === 'popup') {
    // console.log('message from popup', event.data)
  }
  else if (event.data && event.data.payload && event.data.from !== 'injected') {
    // console.log('other message', event.data)
  }
})

// postMessage({ from: 'injected', payload: { message: 'hello from injected' } }, '*')

function isBlacklisted(hostname) {
  const blacklist = ['localhost']
  const likelyIP = Boolean(/\d/.test(hostname.split('.').pop()))
  return blacklist.includes(hostname) || likelyIP
}
