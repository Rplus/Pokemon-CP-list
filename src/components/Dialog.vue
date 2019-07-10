<template>
  <div class="dialog" id="dialog" :aria-hidden="hidden">
   <div class="dialog-content">
    <button class="dialog__closeBtn" @click="close">X</button>
    <details class="lv-cp__iv100">
      <summary>{{ data100Title }}</summary>
      <div class="table">
        <div class="thead">
          <div class="tr">
            <div class="th">Lv</div>
            <div class="th">CP</div>
            <div class="th">HP</div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr"
            v-for="d in data100"
            :key="JSON.stringify(d)"
            @click="setLv([ d.lv ])"
          >
            <div class="td">{{ d.lv }}</div>
            <div class="td">{{ d.cp }}</div>
            <div class="td">{{ d.hp }}</div>
          </div>
        </div>
      </div>
    </details>
    <details class="lv-cp" open="open">
      <summary>{{ dataLvTitle }}</summary>
      <div class="table">
        <div class="thead">
          <div class="tr">
            <span class="th td td-CP" v-for="sLv in pm.sLvs" :data-lv="sLv">CP</span>
            <div class="th td td-A">A</div>
            <div class="th td td-D">D</div>
            <div class="th td td-S">S</div>
            <div class="th td td-IV">IV</div>
            <div class="th td td-HP" v-for="sLv in pm.sLvs" :data-lv="sLv">HP</div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr" v-for="d in dataLv.part1" :key="JSON.stringify(d)">
            <div class="td td-CP" v-for="sLv in pm.sLvs">{{ d.hpcp[sLv].cp }}</div>
            <div class="td td-A">{{ d.atk }}</div>
            <div class="td td-D">{{ d.def }}</div>
            <div class="td td-S">{{ d.sta }}</div>
            <div class="td td-IV">{{ d.iv }}</div>
            <div class="td td-HP" v-for="sLv in pm.sLvs">{{ d.hpcp[sLv].hp }}</div>
          </div>
        </div>
        <details>
          <summary class="no-sticky">more…</summary>
          <div class="tbody">
            <div class="tr" v-for="d in dataLv.part2" :key="JSON.stringify(d)">
              <div class="td td-CP" v-for="sLv in pm.sLvs">{{ d.hpcp[sLv].cp }}</div>
              <div class="td td-A">{{ d.atk }}</div>
              <div class="td td-D">{{ d.def }}</div>
              <div class="td td-S">{{ d.sta }}</div>
              <div class="td td-IV">{{ d.iv }}</div>
              <div class="td td-HP" v-for="sLv in pm.sLvs">{{ d.hpcp[sLv].hp }}</div>
            </div>
          </div>
        </details>
      </div>
    </details>
    <details class="lvs">
      <summary>Levels</summary>
      <div>
        <label
          v-for="lv in lv_1to40"
        >
          <input type="checkbox"
            v-model="pm.sLvs"
            :value="lv"
            :id="`lv-${lv}`"
            :disabled="checkDisabled(lv)"
          >
          <span class="lv">{{ lv }}</span>
        </label>
      </div>
    </details>
    <a href="###">右鍵複製連結網址，分享目前狀態</a>
   </div>
  </div>
</template>


<script>
import pmData from './pmData.js';
import url from './url.js';
import u from './u.js';

const ivs = u.range(10, 15);
const ivList = u.flatten(
  ivs.map(atk =>
    ivs.map(def =>
      ivs.map(sta => ({ atk, def, sta, iv: u.round((atk + def + sta) / 45) }))
    )
  )
);

export default {
  name: 'Dialog',
  props: {
    pm: Object,
  },

  data () {
    window.dialog = this;
    return {
      lv_1to40: new Array(40).fill(1).map((i, j) => j + 1),
    };
  },

  watch: {
    pm: {
      handler (newPm) {
        url.search({
          open: [ newPm.uid, ...newPm.sLvs ].join('-'),
        });
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    close () {
      this.$emit('close-dialog');
    },

    setLv (lv) {
      this.pm.sLvs = [ ...lv ];
    },

    checkDisabled (lv) {
      return (
        (this.pm.sLvs.indexOf(lv) === -1) && (this.pm.sLvs.length >= 3)
      ) || (
        (this.pm.sLvs.indexOf(lv) !== -1) && (this.pm.sLvs.length === 1)
      );
    },
  },

  computed: {
    hidden () {
      return !this.pm;
    },

    data100Title () {
      return `${this.pm.title} IV100 Lv & CP`;
    },

    dataLvTitle () {
      return `${this.pm.title} LV:${this.pm.sLvs.join()} CP list`;
    },

    data100 () {
      return u.range(1, 40)
        .map(lv => {
          return {
            ...pmData.calPmData(this.pm, [15, 15, 15, lv]),
            lv,
          };
        });
    },

    dataLv () {
      const sLvs = this.pm.sLvs;

      let cpList = ivList.map(iv => {
        let { atk, def, sta } = iv;
        return {
          ...iv,
          hpcp: sLvs.reduce((o, lv) => {
            o[lv] = pmData.calPmData(this.pm, [atk, def, sta, lv]);
            return o;
          }, {}),
        };
      });

      cpList.sort((a, b) => {
        let cpDelta = b.hpcp[sLvs[0]].cp - a.hpcp[sLvs[0]].cp;
        let atkDelta = b.atk - a.atk;
        let defDelta = b.def - a.def;
        let staDelta = b.sta - a.sta;
        return (
          cpDelta || (atkDelta || (defDelta || staDelta))
        );
      });

      return {
        cpList,
        part1: cpList.slice(0, 45),
        part2: cpList.slice(45),
      };
    },
  },

};
</script>


<style lang="scss" src="./dialog.scss"></style>
