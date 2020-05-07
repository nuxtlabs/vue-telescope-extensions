"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const store_1 = require("./store");
// array to save domain for checking if allready post
const domainsVisited = [];
const browser = require('webextension-polyfill');
const map = store_1.default.getters.dataInfo;
// send url to analyzer
function sendUrl(url, domain, tabId) {
    return __awaiter(this, void 0, void 0, function* () {
        // loading
        store_1.default.commit('SET_ISLOADING', true);
        yield axios_1.default({
            method: 'GET',
            url: `https://vue-telemetry.netlify.com/api/analyze?url=${url}&src=extension`,
            auth: {
                username: 'nuxt-admin',
                password: 'vue-telemetry-protected-area',
            },
        }).then(({ data }) => {
            // delete useless jsonKey
            delete data.url;
            delete data.hostname;
            delete data.domain;
            delete data.screenshot;
            delete data.meta;
            setMapData(domain, data);
        }).catch(() => {
            browser.browserAction.setIcon({
                tabId,
                path: {
                    16: 'icons/icon-vue-telemetry-404error-128.png',
                    32: 'icons/icon-vue-telemetry-404error-128.png',
                },
            });
            setMapData(domain, 'error');
        });
        store_1.default.commit('SET_ISLOADING', false);
    });
}
// when tab created
function handleCreated(tab) {
    setMapData(tab.url, 'noVue');
    store_1.default.commit('SET_CURRENTDOMAIN', 'noVue');
}
// when tab clicked
function handleActivated() {
    return __awaiter(this, void 0, void 0, function* () {
        // get active tab
        browser.tabs.query({ currentWindow: true, active: true }).then((tabsArray) => {
            if (/^chrome/.test(tabsArray[0].url) || /^about/.test(tabsArray[0].url)) {
                store_1.default.commit('SET_CURRENTDOMAIN', 'noVue');
                setMapData(tabsArray[0].url, 'noVue');
            }
            else {
                detectVue(tabsArray[0].id, tabsArray[0].url);
            }
        });
    });
}
// when tab updated
function handleUpdated(tabId, changeInfo, tabInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('handleUpdated');
        if (changeInfo.status == 'complete') {
            detectVue(tabId, tabInfo.url);
        }
    });
}
browser.tabs.onCreated.addListener(handleCreated);
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onUpdated.addListener(handleUpdated);
// detect vue by calling detector and sendUrl
function detectVue(tabId, url) {
    return __awaiter(this, void 0, void 0, function* () {
        yield hasVue(tabId).then(({ response }) => {
            store_1.default.commit('SET_CURRENTDOMAIN', response.vueInfo.domain);
            if (response.vueInfo.hasVue) {
                browser.browserAction.setIcon({
                    tabId,
                    path: {
                        16: 'icons/icon-robot-128.png',
                        32: 'icons/icon-robot-128.png',
                    },
                });
            }
            if (!domainsVisited.includes(response.vueInfo.domain)) {
                domainsVisited.push(response.vueInfo.domain);
                if (response.vueInfo.hasVue) {
                    sendUrl(url, response.vueInfo.domain, tabId);
                }
                else {
                    setMapData(response.vueInfo.domain, 'noVue');
                    store_1.default.commit('SET_CURRENTDOMAIN', 'noVue');
                }
            }
        });
    });
}
// check vue in detector.js and get response
function hasVue(tabId) {
    return new Promise((resolve) => {
        browser.tabs.sendMessage(tabId, { greeting: '' }).then((response) => {
            console.log('response', response);
            resolve(response);
        });
    });
}
function setMapData(domain, data) {
    map[domain] = data;
    store_1.default.commit('SET_DATAINFO', map);
}
