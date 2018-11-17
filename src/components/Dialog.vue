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
          <div class="tr" v-for="d in data100" :key="JSON.stringify(d)">
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
            <div class="th">CP</div>
            <div class="th">A</div>
            <div class="th">D</div>
            <div class="th">S</div>
            <div class="th">IV</div>
            <div class="th">HP</div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr" v-for="d in dataLv" :key="JSON.stringify(d)">
            <div class="th">{{ d.cp }}</div>
            <div class="th">{{ d.atk }}</div>
            <div class="th">{{ d.def }}</div>
            <div class="th">{{ d.sta }}</div>
            <div class="th">{{ d.iv }}</div>
            <div class="th">{{ d.hp }}</div>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>


<script>
import pmData from './pmData.js';
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

  methods: {
    close () {
      this.$emit('close-dialog');
    },
  },

  computed: {
    hidden () {
      return !this.pm;
    },

    data100Title () {
      if (!this.pm) {
        return '';
      }
      return `${this.pm.title} IV100 Lv & CP`;
    },

    dataLvTitle () {
      if (!this.pm) {
        return '';
      }
      return `${this.pm.title} LV:${this.pm.adsl[3]} CP list`;
    },

    data100 () {
      if (!this.pm) {
        return [];
      }

      return u.range(1, 40)
        .map(lv => {
          return {
            ...pmData.calPmData(this.pm, [15, 15, 15, lv]),
            lv,
          };
        });
    },

    dataLv () {
      if (!this.pm) {
        return [];
      }
      let cpList = ivList.map(iv => {
        let { atk, def, sta } = iv;
        return {
          ...iv,
          ...pmData.calPmData(this.pm, [atk, def, sta, this.pm.adsl[3]]),
        };
      });

      cpList.sort((a, b) => {
        let cpDelta = b.cp - a.cp;
        let atkDelta = b.atk - a.atk;
        let defDelta = b.def - a.def;
        let staDelta = b.sta - a.sta;
        return (
          cpDelta
            ? cpDelta
            : atkDelta
              ? atkDelta
              : defDelta
                ? defDelta
                : staDelta
        );
      });

      return cpList;
    },
  },

};
</script>


<style scoped lang="scss">
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: calc(15em + 10vw);
  max-height: 85vh;
  margin: auto;
  padding: 0 3vw;
  background-color: #fff;
  font-family: monospace;
  font-size: larger;
  overflow: auto;
  box-shadow: 0 0 0 100vw rgba(#000, .25);

  &[aria-hidden="true"] {
    display: none;
  }

  summary,
  .caption {
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: smaller;
    height: 15px;
    background-color: #fff;
  }

  .caption {
    visibility: hidden;
    text-align: center;
  }

  .thead {
    position: sticky;
    top: 1em;
    margin-bottom: 5px;
    padding-top: .3em;
    font-size: smaller;
    font-weight: 900;
    border-bottom: 1px dotted;
    background-color: #fff;
  }

  .tr {
    display: flex;
    align-items: center;
    width: 100%;
    padding-bottom: 2px;
    text-align: center;

    &:hover {
      background-color: #eee;
    }

    &:nth-of-type(3n) {
      margin-bottom: 10px;
    }

    > div {
      width: 15%;
    }

    > div:first-child,
    > div:nth-of-type(5) {
      width: 25%;
    }

    > div:nth-of-type(6) {
      margin-left: .5em;
    }
  }

  .td {
    padding: 1px .5em;
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

</style>
