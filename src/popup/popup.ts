import Vue from 'vue';
import App from './App.vue';
import store from '../store';

new Vue({
  el: '#vtm',
  store,
  render: (h) => h(App),
});
