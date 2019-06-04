<template>
  <div class="pm-list">
    <div
      v-for="pm in pms"
      :class="genClass(pm)"
      :data-isotope="pm.isotope"
      :data-dex="pm.pokedex"
      :style="genStyle(pm)"
      :key="pm.templateId"
    >
      <div class="pm-name" :data-pokedex="pm.pokedex" :title="pm.name">
        {{ pm.title }}
      </div>

      <div class="pm-img" @click="openDialog(pm)" />
      <div class="pm-cp" />
      <div class="pm-info"
        @click="openDialog(pm)"
        :data-atk="pm.stats.baseAttack"
        :data-def="pm.stats.baseDefense"
        :data-sta="pm.stats.baseStamina"
      />
      <div class="pm-types">
        <div
          v-for="type in pm.types"
          :key="`${pm.templateId}--${type}`"
          :class="`pm-type pm-type--${type.toLowerCase().replace('pokemon_type_', '')}`"
        />
      </div>
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
    genStyle (pm) {
      let index = pm.pokedex - 1;
      let row = ~~(index / 28);
      let col = index % 28;
      let specialBgi = (pm.isotope && pm.isotope !== 'NORMAL')
        ? 'url(' + require(`../../public/img/pm/${pm.pokedex}-${pm.isotope.toLowerCase()}.png`) + ')'
        : null;

      if (pm.pokedex > 800) {
        specialBgi = `url(${require(`../../public/img/pm/${pm.pokedex}.png`)})`;
      }

      return {
        '--pm-atk': pm.stats.baseAttack,
        '--pm-def': pm.stats.baseDefense,
        '--pm-sta': pm.stats.baseStamina,
        '--pm-tank': pm.stats.baseStamina * pm.stats.baseDefense,
        '--pm-pokedex': pm.pokedex,
        '--pm-cp': `var(--pm-${pm.uid}-cp)`,
        '--pm-hp': `var(--pm-${pm.uid}-hp)`,
        '--pm-custom-bg': pm.isotope && pm.isotope !== 'NORMAL' ? '1' : null,
        '--pm-col': col,
        '--pm-row': row,
        '--pm-special-bgi': specialBgi,
      };
    },

    genClass (pm) {
      return ['pm', ...pm.class].map(t => t.toLowerCase());
    },

    openDialog (pm) {
      this.$emit('open-dialog', pm);
    },
  },
};
</script>

<style lang="scss">
$types: ('normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'rarity', 'alola');

.pm-list {
  display: grid;
  max-width: 1600px;
  margin: auto;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-gap: calc(2vmin + .5em) calc(1vmin + .5em);
  list-style: none;
}

.pm {
  position: relative;
  display: none;
  padding-top: 1em;
  order: calc(var(--pm-sort-by) * var(--pm-sort-dir));
  counter-reset: cp var(--pm-cp) hp var(--pm-hp);

  &:hover {
    * {
      opacity: unset !important;
    }
  }
}

.pm-cp {
  position: absolute;
  top: 0;
  left: 0;

  &::before {
    content: counter(cp);
    font-size: larger;
    font-family: monospace;
    font-size: calc(1em + 2vmin);
  }
}

.pm-img {
  width: var(--img-size);
  height: var(--img-size);
  margin: 0 30% 0;
  background-image: url('../../public/img/sprite1-4.png');
  background-size:
    calc(var(--sprite-grid-col) * var(--img-size))
    calc(var(--sprite-grid-row) * var(--img-size));
  background-repeat: no-repeat;
  background-position:
    calc(var(--pm-col) * var(--img-size) * -1)
    calc(var(--pm-row) * var(--img-size) * -1);
  opacity: .65;
  cursor: pointer;

  .pm[style*="pm-special-bgi"] & {
    background: var(--pm-special-bgi) no-repeat 50% 50%;
    background-size: contain;
  }
}

.pm-name {
  position: absolute;
  top: 0;
  right: 0;
  padding-left: .5em;
  text-align: right;
  font-size: smaller;
  color: #333;
  opacity: .5;

  &::after {
    content: '\A#' attr(data-pokedex) ' ';
    white-space: pre-wrap;
  }
}

.pm-info {
  position: absolute;
  left: 0;
  bottom: 0;
  white-space: pre;
  font-family: monospace;
  font-size: smaller;
  text-align: right;
  opacity: .5;
  color: lighten(#000, 50%);
  cursor: pointer;

  &::after {
    content:
      counter(hp) ' HP'
      '\A' attr(data-atk) ' A.'
      '\A' attr(data-def) ' D.'
      '\A' attr(data-sta) ' S.';
  }
}

.pm-types {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  opacity: .5;
}

.pm-type {
  width: 1rem;
  height: 1rem;
  margin-right: 2px;
  background-size: contain;
  background-repeat: no-repeat;
  background-origin: content-box;

  @for $i from 1 through length($types) {
    &--#{nth($types, $i)} {
      background-image: url('../../public/img/type/type_#{nth($types, $i)}.png');
    }
  }
}

input[id="show-ads"]:not(:checked) ~ .pm-list .pm-info,
input[id="show-types"]:not(:checked) ~ .pm-list .pm-types {
  opacity: 0;
}


</style>
