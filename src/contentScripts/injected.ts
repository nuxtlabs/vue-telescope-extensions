// import browser from 'webextension-polyfill';

// import detectors as any from 'vue-telescope-analyzer/src/detectors';
import detectors from '../../node_modules/vue-telescope-analyzer/src/detectors.js';

// backward compatibility
(window as any).$vueTelemetryExtension = true;
(window as any).$vueTelescopeExtension = true

async function analyze() {
  if (isBlacklisted(document.location.href))
    return
  // const originalHtml = await fetch(document.location.href).then(res => res.text());
  const originalHtml = document.documentElement.outerHTML
  const context = {
    originalHtml,
    html: document.documentElement.outerHTML,
    scripts: Array.from(document.getElementsByTagName('script')).map(({ src }) => src).filter(script => script),
    page: {
      // eslint-disable-next-line no-eval
      evaluate: (fn: any) => window.eval(`(${fn});`),
    },
  }
  const hasVue = await detectors.hasVue(context)
  const vueVersion = (window as any)?.$nuxt?.$root?.constructor?.version || (window as any).Vue?.version || [...document.querySelectorAll('*')].map(el => el.__vue__?.$root?.constructor?.version || el.__vue_app__?.version).filter(Boolean)[0]
  const { ssr } = await detectors.getVueMeta(context)
  const framework = await detectors.getFramework(context)
  if (framework?.slug === 'nuxtjs' && vueVersion) {
    try {
      framework.version = (window as any).__unctx__?.get('nuxt-app')?.use()?.versions?.nuxt
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
window.addEventListener('message', (event: MessageEvent) => {
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

function isBlacklisted(hostname: string) {
  const blacklist = ['localhost']
  const likelyIP = Boolean(/\d/.test(hostname.split('.').pop() as string))
  return blacklist.includes(hostname) || likelyIP
}
