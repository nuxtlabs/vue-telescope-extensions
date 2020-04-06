import { tabs } from "webextension-polyfill"
import axios from 'axios'
import store from './store'

// map to save id + url for checking if allready post
let domainsVisited = []

// send url to analyzer
async function sendUrl(url) {
  try {
    await axios({
      method: 'GET',
      url: `https://vue-telemetry.netlify.com/api/analyze?url=${url}`,
      auth: {
        username: 'nuxt-admin',
        password: 'vue-telemetry-protected-area'
      }
    }).then(({ data }) => {
      store.dispatch('setData', data)
    }).catch((err) => {
      console.error(err)
    })
  } catch (e) {
    console.error(e)
  }
}

// when tab updated with new url
async function handleUpdated(tabId, changeInfo) {
  if (changeInfo.url) {
    const { response } = await detectVue(tabId)
    // check if not already analyzed
    if (response.vueInfo.hasVue && !domainsVisited.includes(response.vueInfo.domain)) {
      domainsVisited.push(response.vueInfo.domain)
      sendUrl(changeInfo.url, tabId)
    }
  }
}

tabs.onUpdated.addListener(handleUpdated)

// when tab clicked 
async function handleActivated() {
  // get active tab
  tabs.query({ currentWindow: true, active: true }).then(async function (tabsArray) {
    
    const { response } = await detectVue(tabsArray[0].id)
    // check if not already analyzed
    if (response.vueInfo.hasVue && !domainsVisited.includes(response.vueInfo.domain)) {
      domainsVisited.push(response.vueInfo.domain)
      sendUrl(tabsArray[0].url, tabsArray[0].id)
    }
  })
}

tabs.onActivated.addListener(handleActivated)

function detectVue(tabId) {
  return new Promise(resolve => {
    browser.tabs.sendMessage(
      tabId,
      { greeting: '' }
      ).then(response => {
        resolve(response)
      })
    })
  }