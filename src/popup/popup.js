import Vue from 'vue'
import App from './App'
import { store } from '../store'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

global.browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.msg === "something_completed") {
      //  To do something
      console.log(request.response.subject)
      console.log(request.response.content)
    }
  }
);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})