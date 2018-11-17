import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.component('v-style', {
  render: function (createElement) {
    return createElement('style', this.$slots.default);
  },
});

new Vue({
  render: h => h(App),
}).$mount('#app');
