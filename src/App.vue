<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App gg"/>
    <Controller :pm-data=pm />
    <PmList />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Controller from './components/Controller.vue';
import PmList from './components/PmList.vue';
import pmData from './components/pmData.js';

console.log('pmData', pmData);

export default {
  name: 'app',
  components: {
    HelloWorld,
    Controller,
    PmList,
  },
  data () {
    return {
      pm: pmData.pm,
    };
  },
};
</script>

<style lang="scss">
#app {
  margin-top: 60px;
  max-width: 40%;
  margin: 0 auto;
}

body {
  background-color: #000;
  color: #fff;
}
</style>
