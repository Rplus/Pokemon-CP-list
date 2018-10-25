<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App gg"/>
    <Controller />
    <PmList />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Controller from './components/Controller.vue';
import PmList from './components/PmList.vue';
import pmData from './components/pmData.js';

console.log({ pmData });

export default {
  name: 'app',
  components: {
    HelloWorld,
    Controller,
    PmList,
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background-color: #000;
  color: #fff;
}
</style>
