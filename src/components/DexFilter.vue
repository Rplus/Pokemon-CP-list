<template>
  <div class="dex-filters">
    <label for="f-dex-1">dex filter 1</label>
    <input
      type="number"
      id="f-dex-1"
      v-model="v0"
      :min="min"
      :max="max"
    />
    <div class="range">
      <input
        type="range"
        v-model="v0"
        :min="min"
        :max="max"
      />
      <input
        type="range"
        v-model="v1"
        :min="min"
        :max="max"
      />
    </div>
    <label for="f-dex-2">dex filter 2</label>
    <input
      type="number"
      id="f-dex-2"
      v-model="v1"
      :min="min"
      :max="max"
    />
    <div class="gen-range">
      <button @click="setDexRange('gen1')">Gen1</button>
      <button @click="setDexRange('gen2')">Gen2</button>
      <button @click="setDexRange('gen3')">Gen3</button>
      <button @click="setDexRange('gen4')">Gen4</button>
    </div>
    <v-style v-html=dexFilterStyle />
  </div>
</template>


<script>
import pmData from './pmData.js';
const genDex = pmData.genDex;

export default {
  name: 'DexFilter',
  props: {
    'dex-map': Array,
    'dex': Array,
  },
  data () {
    window.DexFilter = this;
    let min = this.dexMap[1];
    let max = this.dexMap[this.dexMap.length - 1];

    return {
      min: min,
      max: max,
      v0: (this.dex && this.dex[0]) || min,
      v1: (this.dex && this.dex[1]) || max,
    };
  },

  computed: {
    dexRange0: function () {
      return Math.min(this.v1, this.v0);
    },

    dexRange1: function () {
      return Math.max(this.v1, this.v0);
    },

    dexFilterStyle: function () {
      this.$emit('set-dex-filter', [this.dexRange0, this.dexRange1]);

      let selectors = this.dexMap
        .filter(dex => (
          dex < this.dexRange0 || dex > this.dexRange1
        ), this)
        .map(dex => `.pm[data-dex="${dex}"]`);

      return `${selectors.join(',')} { display: none !important; }`;
    },
  },

  methods: {
    setDexRange (gen) {
      this.v0 = genDex[gen][0];
      this.v1 = genDex[gen][1];
    },
  },
};
</script>


<style lang="scss">
.dex-filters {
  position: relative;
  display: flex;
  max-width: 30rem;
  margin: 0 auto;
  flex-wrap: wrap;
  text-align: center;

  label {
    position: absolute;
    bottom: 100%;
    color: #ccc;
    font-family: monospace;

    &:nth-of-type(2) {
      right: 0;
    }
  }

  input {
    margin: 0;
    border: unset;
    text-align: center;
  }

  input[type="number"] {
    max-width: 5rem;
    font-size: 1.2rem;
  }
  input[type="range"] {
    width: 100%;
  }

  .range {
    flex-grow: 1;
  }
}

.gen-range {
  width: 100%;

  button {
    margin: 1rem .3rem;
    padding: .3rem;
  }
}
</style>
