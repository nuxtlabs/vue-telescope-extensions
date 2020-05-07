import Vue from 'vue';
import App from './App';
import store from '../store';

new Vue({
  el: '#vtm',
  store,
  render: (h) => h(App),
});
