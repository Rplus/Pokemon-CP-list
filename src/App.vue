<template>
  <div id="app" class="app">

    <a id="go-to-top" href="#">go to top</a>

    <input
      type="checkbox"
      class="sr-only"
      v-for="type in classes"
      :id="`ck-type-${type}`"
      :value="type"
      :key="`ck-type-${type}--ck`"
      v-model="filters"
    />

    <input class="sr-only" type="checkbox" id="show-ads"/>
    <input class="sr-only" type="checkbox" checked="checked" id="show-types"/>

    <template v-for="_sortType in sortTypes">
      <input class="sr-only" type="radio" name="sort-by"
        :key="`${_sortType}▲`"
        :value="`${_sortType}▲`"
        :id="`sort-by-${_sortType}-▲`"
        v-model="sortby"
      />
      <input class="sr-only" type="radio" name="sort-by"
        :key="`${_sortType}▼`"
        :value="`${_sortType}▼`"
        :id="`sort-by-${_sortType}-▼`"
        v-model="sortby"
      />
    </template>

    <header>
      <h1>Pokémon CP List</h1>
    </header>

    <Factor :adsl=adsl @set-factor="setFactor" />

    <Sortby :sort-types=sortTypes />

    <details class="filters section" open>
      <summary>
        Filters
      </summary>

      <div class="type-filters">
        <div>
          <button @click.stop.prevent="chooseAllFilters(false)">None</button>
          <button @click.stop.prevent="chooseAllFilters">All</button>
        </div>

        <TypeFilter :pm-types=classes />
      </div>

      <DexFilter :dex-map=dexMap :dex=dex @set-dex-filter="setDexFilter" />
    </details>

    <PmList :pms=pms @open-dialog="openDialog" />

    <Dialog
      :pm=targetPm
      :adsl=adsl
      @close-dialog="closeDialog"
      v-if="targetPm"
    />

    <footer class="footer">
      <label class="ctrl-info" for="show-ads">show ADS</label>
      <label class="ctrl-info" for="show-types">show types</label>
      <a href="?">RESET</a>
      <ul class="info">
        <li>GitHub repo: <a href="https://github.com/Rplus">Rplus</a> > <a href="https://github.com/Rplus/Pokemon-CP-list">Pokemon-CP-list</a></li>
        <li>image source: <a href="https://veekun.com/dex/downloads">veekun.com</a></li>
        <li>
          <details class="fb-like-details" @toggle="showFBLike">
            <summary>Give a 👍️ with Facebook</summary>
            <div class="fb-like"
              data-href="https://rplus.github.io/Pokemon-CP-list/"
              data-layout="button_count"
              data-action="like"
              data-share="true">
            </div>
          </details>
        </li>
      </ul>
    </footer>

  </div>
</template>

<script>
import TypeFilter from './components/TypeFilter.vue';
import DexFilter from './components/DexFilter.vue';
import PmList from './components/PmList.vue';
import Factor from './components/Factor.vue';
import Dialog from './components/Dialog.vue';
import Sortby from './components/Sortby.vue';

import pmData from './components/pmData.js';
import url from './components/url.js';

export default {
  name: 'app',

  components: {
    TypeFilter,
    DexFilter,
    PmList,
    Factor,
    Dialog,
    Sortby,
  },

  data () {
    window.app = this;

    let targetPm;
    let adsl = url.getPara('adsl') || [15, 15, 15, 20];

    let openArgs = url.getPara('open');

    if (openArgs) {
      let uid = openArgs.shift();
      let pm = pmData.pms.find(pm => pm.uid === uid);

      openArgs = openArgs.map(Number);
      if (!openArgs.length) {
        openArgs = [ adsl[3] ];
      }

      if (pm) {
        targetPm = {
          ...pm,
          sLvs: openArgs.map(Number) || [ adsl[3] ],
        };
      }
    }

    return {
      ...pmData,
      filters: url.getPara('filters') || ['rarity'],
      dex: url.getPara('dex') || [],
      adsl: adsl.map(Number),
      targetPm,
      sortTypes: ['id', 'cp', 'atk', 'def', 'sta', 'tank'],
      sortby: url.getPara('sortby', false) || 'sort-by-id-▲',
    };
  },

  watch: {
    filters (_new) {
      url.search({
        filters: _new.join(url.spliter),
      });
    },

    adsl () {
      url.search({
        adsl: this.adsl.join('-'),
      });
    },

    sortby () {
      url.search({
        sortby: this.sortby,
      });
    },
  },

  methods: {
    setFactor (adsl) {
      this.adsl = adsl;
    },

    setDexFilter (dex) {
      this.dex = dex;
      url.search({
        dex: dex.join('-'),
      });
    },

    chooseAllFilters (toggle = true) {
      this.filters = toggle ? [...this.classes] : [];
    },

    openDialog (pm) {
      this.targetPm = {
        ...pm,
        sLvs: this.adsl.slice(-1),
      };
      url.search({
        open: [ pm.uid, this.adsl[3] ].join('-'),
      });
    },

    closeDialog () {
      this.targetPm = null;
      url.search({
        open: null,
      });
    },

    showFBLike () {
      console.log('showFBLike');
      if (this.fbLikeInit) {
        return;
      }

      // https://developers.facebook.com/docs/plugins/like-button
      (function (d, s, id) {
        var js;
        var fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      this.fbLikeInit = true;
    },
  },
};
</script>

<style lang="scss" src="@/style.scss"></style>
