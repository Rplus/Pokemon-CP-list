<template>
  <div>
    <template v-for="type in pmTypes">
      <label :for="`ck-type-${type}`" class="filter-label" :key="`ck-type-${type}--label`">
        <img :src="imgSrc(type)" />
        {{ type }}
      </label>
    </template>
  </div>
</template>

<script>
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default {
  name: 'TypeFilter',

  props: {
    'pm-types': Array,
  },

  methods: {
    imgSrc (type) {
      return require(`../assets/type/type_${capitalize(type)}.png`);
    },
  },
};
</script>

<style lang="scss">
  $types: (
    alola, bug, dark, dragon, electric, fairy, fighting, fire, flying, ghost,
    grass, ground, ice, normal, poison, psychic, rarity, rock, steel, water
  );
  @each $type in $types {
    #ck-type-#{$type}:checked {
      & ~ .filters .filter-label[for="ck-type-#{$type}"] {
        --activity: 1;
      }

      & ~ .pm-list .pm.pokemon_type_#{$type} {
        display: unset;
      }
    }
  }

  .filter-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-width: 7em;
    text-transform: capitalize;
    margin-bottom: .3em;

    img {
      width: 24px;
      height: 24px;
      margin-right: .2em;
      vertical-align: middle;
      filter: contrast(var(--activity, 0));
      opacity: var(--activity, 0.3);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: -1;
      width: 24px;
      height: 24px;
      background-color: rgba(255, 255, 153, 0.5);
      border-radius: 50%;
      transform: scale(1.2);
      opacity: var(--activity, 0);
    }
  }
</style>
