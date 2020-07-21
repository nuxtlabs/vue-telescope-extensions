import axios from 'axios'
import store from './store'

const browser = require('webextension-polyfill')

// send url to analyzer
async function analyze (tabId, url) {
  await axios({
    method: 'GET',
    url: `https://vuetelemetry.com/api/analyze?url=${url}&src=extension`,
    auth: {
      username: 'nuxt-admin',
      password: 'vue-telemetry-protected-area'
    }
  }).then(({ data }) => {
    browser.browserAction.setIcon({
      tabId,
      path: 'icons/icon-128.png'
    })

    store.commit('SET_SHOWCASE', data.body)
  }).catch((e) => {
    store.commit('SET_SHOWCASE', e.response &&  e.response.data && e.response.data.statusCode === 400 ? 'noVue' : 'error')
  })
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

// detect vue by calling detector and analyze
async function detectVue (tabId, url) {
  browser.browserAction.setIcon({
    tabId,
    path: 'icons/icon-grey-128.png'
  })

  store.commit('SET_DOMAIN', null)

  if (!url) {
    return
  }
  if (/^https:\/\//.test(url) === false) {
    return
  }

  store.commit('SET_ISLOADING', true)

  try {
    const { response } = await resolveVue(tabId)
    const { domain, hasVue } = response.vueInfo

    store.commit('SET_DOMAIN', domain)

    const showcase = store.getters.showcase

    if (showcase) {
      if (showcase.id) {
        browser.browserAction.setIcon({
          tabId,
          path: 'icons/icon-128.png'
        })
      }
    } else {
      if (hasVue) {
        await analyze(tabId, url)
      } else {
        store.commit('SET_SHOWCASE', 'noVue')
      }
    }
  } catch (e) {
  }

  store.commit('SET_ISLOADING', false)
}

// check vue in content.js and get response
function resolveVue (tabId) {
  return new Promise((resolve) => {
    browser.tabs.sendMessage(
      tabId,
      { greeting: '' }
    ).then((response) => {
      resolve(response)
    }).catch((_) => {})
  })
}
