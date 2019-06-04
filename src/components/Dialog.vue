<template>
  <div class="dialog" id="dialog" :aria-hidden="hidden">
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
      handler(newPm) {
        url.search({
          open: [ newPm.uid, ...newPm.sLvs ].join('-'),
        });
      },
      immediate: true,
      deep: true,
    }
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


<style lang="scss">
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: calc(17em + 10vw);
  max-height: 85vh;
  margin: auto;
  padding: 0 3vw;
  background-color: #fff;
  font-family: monospace;
  font-size: larger;
  overflow: auto;
  box-shadow: 0 0 0 100vw rgba(#000, .25);

  // dialog shadow overlay
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  &[aria-hidden="true"] {
    display: none;
  }

  summary:not(.no-sticky),
  .caption {
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: smaller;
    height: 1.5em;
    margin-bottom: .5em;
    background-color: #fff;
    box-shadow: 0 -3px #fff;
  }


  details details summary {
    margin-left: 1em;
    margin-right: 1em;
    background-color: #eef;
  }

  .no-sticky {
    margin-bottom: 1em;
    font-size: smaller;
  }

  .caption {
    visibility: hidden;
    text-align: center;
  }

  .thead {
    position: sticky;
    top: 1.2em;
    margin-bottom: 5px;
    padding-top: .3em;
    font-size: smaller;
    font-weight: 900;
    border-bottom: 1px dotted;
    background-color: #ffe;
  }

  .tr {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-bottom: 2px;
    text-align: center;

    &:hover {
      background-color: #eee;
    }

    &:nth-of-type(3n) {
      margin-bottom: 10px;
    }

    .td-CP {
      width: 3rem;

      // hide Lv indicator of CP when there is just one Lv.
      &:only-of-type::after {
        display: none;
      }

      // there is no more space of "HP" when there are multi Lv
      + .td-CP ~ .td-HP {
        display: none;
      }
    }

    .td-IV,
    .td-HP {
      width: 2.5rem;
    }
  }

  .td {
    width: 2rem;
    padding: 1px 5px;
  }

  .th.td-CP:after {
    content: attr(data-lv);
    font-size: 12px;
    font-weight: 100;
    transform-origin: 50% 0;
    transform: scale(.75);
    position: absolute;
  }

  .dialog__closeBtn {
    position: fixed;
    top: 5vh;
    right: 2vw;
    font-size: 8vw;
  }

  .lv-cp__iv100 {
    .thead,
    .tbody {
      columns: 2;
      column-gap: .5em;
      column-rule: dotted 1px #ccc;
    }

    .tr {
      &:nth-of-type(3n) {
        margin-bottom: unset;
      }

      &:nth-of-type(5n) {
        margin-bottom: 10px;
      }

      > div {
        width: 30%;
        color: lighten(#000, 70%);
        font-size: smaller;

        &:nth-of-type(1) {
          width: 20%;
        }

        &:nth-of-type(2) {
          width: 50%;
          color: #000;
          font-size: larger;
          font-weight: 900;
        }
      }
    }
  }

  details {
    margin-top: 1em;
    margin-bottom: 1em;
  }
}

.lvs {
  label {
    position: relative;
    display: inline-block;
    width: 10%;
    margin: .5em 5%;
    cursor: pointer;
    font-size: smaller;
    text-align: center;
  }

  .lv {
    position: relative;
    display: block;
    padding: .25em .25em;
    background-color: rgba(#000, .03);
  }

  input {
    position: absolute;
    z-index: -1;
    display: unset;
    width: unset;
    pointer-events: none;
    visibility: hidden;

    &:checked + .lv {
      font-weight: 900;
      text-shadow: 1px 1px #999;
      box-shadow: 0 0 0 1px;
    }

    &:disabled + .lv {
      opacity: .3;
    }
  }
}

</style>
