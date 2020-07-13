import axios from 'axios'
import store from './store'

// array to save domain for checking if allready post
const domainsVisited = []
const browser = require('webextension-polyfill')

const map = store.getters.dataInfo
// send url to analyzer
async function sendUrl (url, domain, tabId) {
  // loading
  store.commit('SET_ISLOADING', true)

  await axios({
    method: 'GET',
    url: `https://vuetelemetry.com/api/analyze?url=${url}&src=extension`,
    auth: {
      username: 'nuxt-admin',
      password: 'vue-telemetry-protected-area'
    }
  }).then(({ data }) => {
    setMapData(domain, data.body)
  }).catch((e) => {
    browser.browserAction.setIcon({
      tabId,
      path: {
        16: 'icons/icon-grey-128.png',
        32: 'icons/icon-grey-128.png'
      }
    })
    setMapData(domain, e.response.data.statusCode === 400 ? 'noVue' : 'error')
  })

  store.commit('SET_ISLOADING', false)
}

// when tab clicked
async function handleActivated () {
  // get active tab
  browser.tabs.query({ currentWindow: true, active: true }).then((tabsArray) => {
    const { id, url, status } = tabsArray[0]

    if (status === 'complete') {
      detectVue(id, url)
    }
  })
}

// when tab updated
async function handleUpdated (tabId, changeInfo, tabInfo) {
  if (changeInfo.status === 'complete') {
    detectVue(tabId, tabInfo.url)
  }
}

browser.tabs.onActivated.addListener(handleActivated)
browser.tabs.onUpdated.addListener(handleUpdated)

// detect vue by calling detector and sendUrl
async function detectVue (tabId, url) {
  store.commit('SET_CURRENTDOMAIN', url)

  if (!url) {
    return
  }
  if (/^chrome/.test(url) || /^about/.test(url)) {
    return setMapData(url, 'noVue')
  }

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
      }
    }
  })
}

// check vue in content.js and get response
function hasVue (tabId) {
  return new Promise((resolve) => {
    browser.tabs.sendMessage(
      tabId,
      { greeting: '' }
    ).then((response) => {
      resolve(response)
    })
  })
}

function setMapData (domain, data) {
  map[domain] = data
  store.commit('SET_DATAINFO', map)
}
