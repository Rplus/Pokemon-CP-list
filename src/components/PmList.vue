<template>
  <div class="pm-list">
    <div
      v-for="p in pms"
      :class="genClass(p)"
      :data-isotope="p.isotope"
      :data-dex="p.pokedex"
      :style="genStyle(p)"
      :key="p.templateId"
    >
      <details>
        <summary>
          {{ getPmName(p) }}
        </summary>
        <pre>{{ p }}</pre>
      </details>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PmList',
  props: {
    'pms': Array,
  },
  methods: {
    getL10n (strings, lang = window.lang) {
      return strings[lang];
    },

    getPmName: function (p) {
      return this.getL10n(p.names);
    },

    genStyle: function (pm) {
      return {
        '--pm-atk': pm.stats.baseAttack,
        '--pm-def': pm.stats.baseDefense,
        '--pm-sta': pm.stats.baseStamina,
        '--pm-tank': pm.stats.baseStamina * pm.stats.baseDefense,
        '--pm-pokedex': pm.pokedex,
        '--pm-cp': `var(--pm-${pm.uid}-cp)`,
        '--pm-hp': `var(--pm-${pm.uid}-hp)`,
        '--pm-custom-bg': pm.isotope && pm.isotope !== 'NORMAL' ? '1' : null,
      };
    },

    genClass: function (pm) {
      return ['pm', ...pm.types].map(t => t.toLowerCase());
    },
  },
};
</script>

<style lang="scss">
  .pm {
    display: none;
  }
</style>
