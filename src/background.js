import { tabs } from "webextension-polyfill"
import axios from 'axios'
import store from './store'

// map to save id + url for checking if allready post
let domainsVisited = []
let dataMap = new Map()

// send url to analyzer
async function sendUrl(url, domain) {

  //loading
  store.commit('SET_ISLOADING', true);

  try {
    await axios({
      method: 'GET',
      url: `https://vue-telemetry.netlify.com/api/analyze?url=${url}&src=extension`,
      auth: {
        username: 'nuxt-admin',
        password: 'vue-telemetry-protected-area'
      },
    }).then(({ data }) => {
      //not need tag meta
      delete data.url
      delete data.hostname
      delete data.domain
      delete data.screenshot
      delete data.meta
      dataMap.set(domain, data)
      store.commit('SET_DATA', dataMap)
    }).catch((err) => {
      store.commit('SET_CURRENTDOMAIN', "WSError")
    })
  } catch (e) {
    store.commit('SET_CURRENTDOMAIN', "WSError")
  }
  store.commit('SET_ISLOADING', false);
}

// when tab updated 
async function handleUpdated(tabId, changeInfo, tabInfo) {
  if (changeInfo.status == "complete") {
    await detectVue(tabId, tabInfo.url)
  }
}

tabs.onUpdated.addListener(handleUpdated)

// when tab clicked 
async function handleActivated() {
  // get active tab
  tabs.query({ currentWindow: true, active: true }).then(async function (tabsArray) {
    await detectVue(tabsArray[0].id, tabsArray[0].url)
  })
}

tabs.onActivated.addListener(handleActivated)

//function to detect vue and send url
async function detectVue(tabId, url) {

  store.commit('SET_CURRENTDOMAIN', 'noVue')

  //Check vue
  await hasVue(tabId).then(({ response }) => {

    //set store current domain

    if (response.vueInfo.hasVue) {

      store.commit('SET_CURRENTDOMAIN', response.vueInfo.domain)

      browser.browserAction.setIcon({
        tabId: tabId,
        path: {
          16: `icons/icon-nuxtjs.png`,
          48: `icons/icon-nuxtjs.png`,
          128: `icons/icon-nuxtjs.png`
        }
      })
    }

    // if not already analyzed
    if (!domainsVisited.includes(response.vueInfo.domain)) {

      domainsVisited.push(response.vueInfo.domain)

      //send url and change icon extension
      if (response.vueInfo.hasVue) {
        sendUrl(url, response.vueInfo.domain)
      }
    }

    return response.vueInfo.hasVue;

  }).catch((err) => {
    //set store current domain to error 
    store.commit('SET_CURRENTDOMAIN', "noVUe")
    return false;
  })
}

//check vue in detector.js and get response
function hasVue(tabId) {
  return new Promise(resolve => {
    browser.tabs.sendMessage(
      tabId,
      { greeting: '' }
    ).then(response => {
      resolve(response)
    })
  })
}