import { tabs } from "webextension-polyfill"
import axios from 'axios'
import store from './store'
import { currentDomain, data } from "./store/getters"

// map to save id + url for checking if allready post
let domainsVisited = []
let dataMap = new Map()

// send url to analyzer
async function sendUrl(url, domain, tabId) {

  //loading
  store.commit('SET_ISLOADING', true);
  console.log("SEND URL")

  await axios({
    method: 'GET',
    url: `https://vue-telemetry.netlify.com/api/analyze?url=${url}&src=extension`,
    auth: {
      username: 'nuxt-admin',
      password: 'vue-telemetry-protected-area'
    },
  }).then(({ data }) => {

    delete data.url
    delete data.hostname
    delete data.domain
    delete data.screenshot
    delete data.meta

    dataMap.set(domain, data)

    store.commit('SET_DATA', dataMap)
  }).catch((err) => {
    browser.browserAction.setIcon({
      tabId: tabId,
      path: {
        16: `icons/icon-vue-telemetry-404error-16.png`,
        48: `icons/icon-vue-telemetry-404error-48.png`,
        128: `icons/icon-vue-telemetry-404error-128.png`
      }
    })
    dataMap.set(domain, "error")
    store.commit('SET_DATA', dataMap)
  })

  store.commit('SET_ISLOADING', false);
}

// when tab updated 
async function handleUpdated(tabId, changeInfo, tabInfo) {
  if (changeInfo.status == "complete") {
    detectVue(tabId, tabInfo.url)
  }
}

tabs.onUpdated.addListener(handleUpdated)

// when tab clicked 
async function handleActivated() {
  // get active tab
  tabs.query({ currentWindow: true, active: true }).then(function (tabsArray) {
    detectVue(tabsArray[0].id, tabsArray[0].url)
  })
}

tabs.onActivated.addListener(handleActivated)

function handleCreated(tab) {
  store.commit('SET_CURRENTDOMAIN', "newTab")
}

tabs.onCreated.addListener(handleCreated);

//function to detect vue and send url
async function detectVue(tabId, url) {

  //Check vue
  await hasVue(tabId).then(({ response }) => {

    store.commit('SET_CURRENTDOMAIN', response.vueInfo.domain)

    if (!domainsVisited.includes(response.vueInfo.domain)) {

      domainsVisited.push(response.vueInfo.domain)

      if (response.vueInfo.hasVue) {

        browser.browserAction.setIcon({
          tabId: tabId,
          path: {
            16: `icons/icon-vue-telemetry-16.png`,
            48: `icons/icon-vue-telemetry-48.png`,
            128: `icons/icon-vue-telemetry-128.png`
          }
        })

        sendUrl(url, response.vueInfo.domain, tabId)
      } else {
        store.commit('SET_CURRENTDOMAIN', "noVue")
      }
    }
  })
}

//check vue in detector.js and get response
function hasVue(tabId) {

  return new Promise(resolve => {
    // chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    //     console.log(response.farewell);
    //   });

    chrome.tabs.sendMessage(
      tabId,
      { greeting: '' }
    ).then(response => {
      resolve(response)
    })
  })
} 
