import axios from 'axios'
import store from './store'
import { currentDomain } from './store/getters'

// map to save id + url for checking if allready post
let domainsVisited = []
let browser = require("webextension-polyfill");


// send url to analyzer
async function sendUrl(url, domain, tabId) {

  //loading
  store.commit('SET_ISLOADING', true);

  let map = store.getters.dataInfo;

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

    //dataMap.set(domain, data)
    map[domain] = data;
    console.log("INFO", map)
    store.commit('SET_DATAINFO', map)
  }).catch((err) => {

    browser.browserAction.setIcon({
      tabId: tabId,
      path: {
        16: `icons/icon-vue-telemetry-404error-128.png`,
        32: `icons/icon-vue-telemetry-404error-128.png`
      }
    })
    map[domain] = "error";
    store.commit('SET_DATAINFO', map)
  })

  store.commit('SET_ISLOADING', false);
}

// when tab updated 
async function handleUpdated(tabId, changeInfo, tabInfo) {
  if (changeInfo.status == "complete") {
    detectVue(tabId, tabInfo.url)
  }
}

browser.tabs.onUpdated.addListener(handleUpdated)

// when tab clicked 
async function handleActivated() {
  // get active tab
  browser.tabs.query({ currentWindow: true, active: true }).then(function (tabsArray) {

    if (/^chrome/.test(tabsArray[0].url) || /^about/.test(tabsArray[0].url)) {
      store.commit('SET_CURRENTDOMAIN', "noVue")
      let map = store.getters.dataInfo;
      map[tabsArray[0].url] = "noVue"
    } else {
      detectVue(tabsArray[0].id, tabsArray[0].url)
    }
  })
}

browser.tabs.onActivated.addListener(handleActivated)

function handleCreated(tab) {
  let map = store.getters.dataInfo;
  map[tab.url] = "noVue"
  store.commit('SET_CURRENTDOMAIN', "noVue")
}

browser.tabs.onCreated.addListener(handleCreated);

//function to detect vue and send url
async function detectVue(tabId, url) {

  //Check vue
  await hasVue(tabId).then(({ response }) => {

    store.commit('SET_CURRENTDOMAIN', response.vueInfo.domain)

    if (response.vueInfo.hasVue)
      browser.browserAction.setIcon({
        tabId: tabId,
        path: {
          16: "icons/icon-robot-128.png",
          32: "icons/icon-robot-128.png",
        }
      })

    if (!domainsVisited.includes(response.vueInfo.domain)) {

      domainsVisited.push(response.vueInfo.domain)

      if (response.vueInfo.hasVue) {
        sendUrl(url, response.vueInfo.domain, tabId)
      } else {
        console.log("DOMAIN", response.vueInfo.domain)
        let map = store.getters.dataInfo;
        map[response.vueInfo.domain, "noVue"]
        store.commit('SET_CURRENTDOMAIN', "noVue")
      }
    }

  }).catch((err) => {
    let map = store.getters.dataInfo;
    map[response.vueInfo.domain, "noVue"]
  })

}

//check vue in detector.js and get response
function hasVue(tabId) {

  return new Promise(resolve => {
    // chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    //     console.log(response.farewell);
    //   });

    browser.tabs.sendMessage(
      tabId,
      { greeting: '' }
    ).then(response => {
      resolve(response)
    })
  })
} 
