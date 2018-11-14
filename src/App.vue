<template>
  <div id="app">

    <input
      type="checkbox"
      v-for="type in types"
      :id="`ck-type-${type}`"
      :value="type"
      :key="`ck-type-${type}--ck`"
      v-model="filters"
    />

    <header>
      <h1>Pokémon CP List</h1>
    </header>

    <Factor :adsl=adsl @set-factor="setFactor" />

    <section class="filters">
      <div class="type-filters">
        <button @click.stop.prevent="chooseAllFilters">all</button>
        <button @click.stop.prevent="chooseAllFilters(false)">none</button>

        <TypeFilter :pm-types=types />

      </div>

      <DexFilter :dex-map=dexMap :dex=dex @set-dex-filter="setDexFilter" />

    </section>

    <PmList :pms=pms />

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import TypeFilter from './components/TypeFilter.vue';
import DexFilter from './components/DexFilter.vue';
import PmList from './components/PmList.vue';
import Factor from './components/Factor.vue';

import pmData from './components/pmData.js';
import url from './components/url.js';

window.url = url;

console.log(pmData);

export default {
  name: 'app',

  components: {
    HelloWorld,
    TypeFilter,
    DexFilter,
    PmList,
    Factor,
  },

  data () {
    window.app = this;
    return {
      ...pmData,
      filters: url.getPara('filters') || ['rarity'],
      dex: url.getPara('dex') || [],
      adsl: url.getPara('adsl') || [15, 15, 15, 20],
    };
  },

  watch: {
    filters (_new) {
      url.search({
        filters: _new.join(url.spliter),
      });
    },
  },

  methods: {
    setFactor (adsl) {
      url.search({
        adsl: adsl.join('-'),
      });
    },

    setDexFilter (dex) {
      url.search({
        dex: dex.join('-'),
      });
    },

    chooseAllFilters: function (toggle = true) {
      this.filters = toggle ? [...this.types] : [];
    },
  },
};
</script>

<style lang="scss">
#app {
  margin-top: 60px;
  max-width: 40%;
  max-width: 60%;
  margin: 0 auto;
}

body {
  overflow-y: scroll;
  background-color: #aaa;
}
</style>
