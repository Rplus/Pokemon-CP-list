<template>
  <section class="factors section">
    <table class="factors-table">
      <tr>
        <td><label for="f-lv">PM Lv:</label></td>
        <td><input type="number" min="1" max="40" v-model.number="l" step="0.5" id="f-lv" /></td>
        <td><button @click="l -= 5">-5</button></td>
        <td><input type="range" min="1" max="40" v-model.number="l" step="0.5" /></td>
        <td><button @click="l += 5">+5</button></td>
      </tr>
      <tr>
        <td><label for="f-a">Attack:</label></td>
        <td><input type="number" min="0" max="15" step="1" v-model.number="a" id="f-a" /></td>
        <td><button @click="a -= 1">-1</button></td>
        <td><input type="range" min="0" max="15" step="1" v-model.number="a" /></td>
        <td><button @click="a += 1">+1</button></td>
      </tr>
      <tr>
        <td><label for="f-d">Defense:</label></td>
        <td><input type="number" min="0" max="15" step="1" v-model.number="d" id="f-d" /></td>
        <td><button @click="d -= 1">-1</button></td>
        <td><input type="range" min="0" max="15" step="1" v-model.number="d" /></td>
        <td><button @click="d += 1">+1</button></td>
      </tr>
      <tr>
        <td><label for="f-s">Stamina:</label></td>
        <td><input type="number" min="0" max="15" step="1" v-model.number="s" id="f-s" /></td>
        <td><button @click="s -= 1">-1</button></td>
        <td><input type="range" min="0" max="15" step="1" v-model.number="s" /></td>
        <td><button @click="s += 1">+1</button></td>
      </tr>
      <tr>
        <td>IV</td>
        <td colspan="4">{{ iv }}%</td>
      </tr>
    </table>
    <v-style v-html=pmCpHp />
  </section>
</template>

<script>
import pmData from './pmData.js';

export default {
  name: 'Factor',
  props: {
    'adsl': Array,
  },

  data () {
    window.Factor = this;
    return this.getADSL();
  },

  methods: {
    getADSL () {
      let [a, d, s, l] = this.adsl;
      return {
        a: this.normalizeNumber(a),
        d: this.normalizeNumber(d),
        s: this.normalizeNumber(s),
        l: this.normalizeNumber(l, 1, 40),
      };
    },

    normalizeNumber (n, min = 0, max = 15) {
      if (n >= min && n <= max) {
        return n;
      }
      return Math.min(Math.max(n, min), max);
    },
  },

  watch: {
    adsl () {
      Object.assign(this, this.getADSL());
    },
  },

  computed: {
    iv () {
      let adsl = [this.a, this.d, this.s, this.l];
      this.$emit('set-factor', adsl);
      // this.updatePmData(adsl);
      return Math.round(100 * (this.a + this.d + this.s) / 45);
    },

    pmCpHp () {
      let adsl = [this.a, this.d, this.s, this.l];
      let pmDataStyle = pmData.pms.map(pm => {
        let { cp, hp } = pmData.calPmData(pm, adsl);
        return `--pm-${pm.uid}-cp: ${cp}; --pm-${pm.uid}-hp: ${hp};`;
      });
      return `.pm-list { ${pmDataStyle.join(' ')} }`;
    },
  },
};
</script>


<style lang="scss">
.factors {
  text-align: left;
}

.factors-table {
  margin-left: auto;
  margin-right: auto;
  border-spacing: .5em .25em;
  font-size: smaller;

}
</style>
