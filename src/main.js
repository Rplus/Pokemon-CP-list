import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

window.lang = navigator.language.slice(0, 2);

// String.prototype.capitalize = function () {
//   return this.charAt(0).toUpperCase() + this.slice(1);
// };

// Number.prototype.clamp = function (min, max) {
//   return Math.min(Math.max(this, min), max);
// };

Vue.component('v-style', {
  render: function (createElement) {
    return createElement('style', this.$slots.default);
  },
});

new Vue({
  render: h => h(App),
}).$mount('#app');
