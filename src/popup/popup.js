import Vue from 'vue'
import App from './App.vue'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
