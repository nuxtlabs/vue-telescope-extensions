import axios from 'axios'
import store from './store'

// array to save domain for checking if allready post
const domainsVisited: Array<String> = []
const browser = require('webextension-polyfill')

const map = store.getters.dataInfo
// send url to analyzer
async function sendUrl(url: string, domain: string, tabId: number) {
  // loading
  store.commit('SET_ISLOADING', true)

  await axios({
    method: 'GET',
    url: `https://vue-telemetry.nuxtjs.app/api/analyze?url=${url}&src=extension`,
    auth: {
      username: 'nuxt-admin',
      password: 'vue-telemetry-protected-area'
    }
  }).then(({ data }) => {
    // delete useless jsonKey
    delete data.url
    delete data.hostname
    delete data.domain
    delete data.screenshot
    delete data.meta

    setMapData(domain, data)
  }).catch(() => {
    browser.browserAction.setIcon({
      tabId,
      path: {
        16: 'icons/icon-grey-128.png',
        32: 'icons/icon-grey-128.png'
      }
    })
    setMapData(domain, 'error')
  })

  store.commit('SET_ISLOADING', false)
}

// when tab created
function handleCreated(tab: { url: string }) {
  setMapData(tab.url, 'noVue')
  store.commit('SET_CURRENTDOMAIN', 'noVue')
}

// when tab clicked
async function handleActivated() {
  // get active tab
  browser.tabs.query({ currentWindow: true, active: true }).then((tabsArray: { id: number, url: string; }[]) => {
    if (/^chrome/.test(tabsArray[0].url) || /^about/.test(tabsArray[0].url)) {
      store.commit('SET_CURRENTDOMAIN', 'noVue')
      setMapData(tabsArray[0].url, 'noVue')
    } else {
      detectVue(tabsArray[0].id, tabsArray[0].url)
    }
  })
}

// when tab updated
async function handleUpdated(tabId: number, changeInfo: { status: string }, tabInfo: { url: string }) {
  if (changeInfo.status === 'complete') {
    detectVue(tabId, tabInfo.url)
  }
}

browser.tabs.onCreated.addListener(handleCreated)
browser.tabs.onActivated.addListener(handleActivated)
browser.tabs.onUpdated.addListener(handleUpdated)

// detect vue by calling detector and sendUrl
async function detectVue(tabId: number, url: string) {
  await hasVue(tabId).then(({ response }) => {
    store.commit('SET_CURRENTDOMAIN', response.vueInfo.domain)

    if (response.vueInfo.hasVue) {
      browser.browserAction.setIcon({
        tabId,
        path: {
          16: 'icons/icon-128.png',
          32: 'icons/icon-128.png'
        }
      })
    }

    if (!domainsVisited.includes(response.vueInfo.domain)) {
      domainsVisited.push(response.vueInfo.domain)

      if (response.vueInfo.hasVue) {
        sendUrl(url, response.vueInfo.domain, tabId)
      } else {
        setMapData(response.vueInfo.domain, 'noVue')
        store.commit('SET_CURRENTDOMAIN', 'noVue')
      }
    }
  })
}

// check vue in detector.js and get response
function hasVue(tabId: number) {
  return new Promise((resolve) => {
    browser.tabs.sendMessage(
      tabId,
      { greeting: '' }
    ).then((response: any) => {
      resolve(response)
    })
  })
}

function setMapData(domain: string, data: any) {
  map[domain] = data
  store.commit('SET_DATAINFO', map)
}
