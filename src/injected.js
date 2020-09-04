// const browser = require('webextension-polyfill')

const detectors = require('vue-telemetry-analyzer/src/detectors')

async function analyzeLocally () {
  const originalHtml = await fetch(document.location.href).then(res => res.text())
  const context = {
    originalHtml,
    html: document.documentElement.outerHTML,
    scripts: Array.from(document.getElementsByTagName('script')).map(({ src }) => src).filter(script => script),
    page: {
      evaluate: (fn) => window.eval(`(${fn});`)
    }
  }
  const hasVue = await detectors.hasVue(context)
  // console.log('hasVue', hasVue)
  // if (hasVue) {
  //   //
  // }
  const meta = await detectors.getVueMeta(context)
  const framework = await detectors.getFramework(context)
  const ui = await detectors.getUI(context)
  const plugins = await detectors.getPlugins(context)
  const nuxtMeta = await detectors.getNuxtMeta(context)
  const modules = await detectors.getNuxtModules(context)

  window.postMessage({
    from: 'injected',
    action: 'analyzeLocally',
    payload: {
      url: document.location.href,
      hasVue,
      vueVersion: meta.version,
      // meta,
      plugins,
      framework,
      ui,
      hasSSR: nuxtMeta.ssr,
      isStatic: nuxtMeta.static,
      modules
    }
  })
}

analyzeLocally()

// listen to messages from content/popup/other script
window.addEventListener('message', function (event) {
  if (event.data && event.data.from === 'content') {
    console.log('message from content', event.data)
  } else if (event.data && event.data.from === 'popup') {
    console.log('message from popup', event.data)
  } else if (event.data && event.data.payload && event.data.from !== 'injected') {
    // console.log('other message', event.data)
  }
})

// postMessage({ from: 'injected', payload: { message: 'hello from injected' } }, '*')
