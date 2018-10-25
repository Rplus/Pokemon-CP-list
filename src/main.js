import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

window.lang = navigator.language.slice(0, 2);

new Vue({
  render: h => h(App),
}).$mount('#app');
