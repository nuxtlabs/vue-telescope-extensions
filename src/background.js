import { tabs } from "webextension-polyfill";
import axios from 'axios';
import { store } from './store'

const detectors = {
    vue: require('../detectors/vue.json'),
}


//map to save id + url for checking if allready post
var domainsVisited = []

//send url to analyzer
async function sendUrl(url, tabId) {
    try {
        await axios({
            method: "get",
            url: 'https://vue-telemetry.netlify.com/api/analyze?url=' + url,
            auth: {
                username: 'nuxt-admin',
                password: 'vue-telemetry-protected-area'
            }
        }).then(function (resp) {
            console.log(resp)
            global.browser.runtime.sendMessage({
                msg: "something_completed",
                response: {
                    subject: "Loading",
                    content: "Just completed!"
                }
            });
        }).catch(function (err) {
            console.log(err)
        });
    } catch (e) {
        console.log(e)
    }
}

//when tab updated with new url
async function handleUpdated(tabId, changeInfo, tabInfo) {
    if (changeInfo.url) {
        const result = await detectVue(tabId);
        //check if not already analyzed
        if (result.response.hasVue && !domainsVisited.includes(result.response.domain)) {
            domainsVisited.push(result.response.domain)
            console.log("send url")
            sendUrl(changeInfo.url, tabId);
        }
    }
}

tabs.onUpdated.addListener(handleUpdated);

//when tab clicked 
async function handleActivated(activeInfo) {
    //get active tab
    tabs.query({ currentWindow: true, active: true }).then(async function (tabsArray) {

        const result = await detectVue(tabsArray[0].id);

        //check if not already analyzed
        if (result.response.hasVue && !domainsVisited.includes(result.response.domain)) {
            domainsVisited.push(result.response.domain)
            console.log("send url")
            sendUrl(tabsArray[0].url, tabsArray[0].id);
        }
    });
}

tabs.onActivated.addListener(handleActivated);

function detectVue(tabId) {
    return new Promise(resolve => {
        browser.tabs.sendMessage(
            tabId,
            { greeting: "" }
        ).then(response => {
            console.log("response => ", response.response)
            resolve(response)
        });
    });
}
