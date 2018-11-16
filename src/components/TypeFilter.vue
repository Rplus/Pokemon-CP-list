<template>
  <div class="type-filters-box">
    <template v-for="type in pmTypes">
      <label :for="`ck-type-${type}`" class="filter-label" :key="`ck-type-${type}--label`">
        <img :src="imgSrc(type)" />
        {{ type }}
      </label>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TypeFilter',

  props: {
    'pm-types': Array,
  },

  methods: {
    imgSrc (type) {
      return require(`../assets/type/type_${type}.png`);
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

  .section {
    text-align: center;
    margin-bottom: 1rem;
  }

  .section summary {
    text-align: center;
    margin: 0 auto 1rem;
    padding: .5rem 1.5rem;
    display: inline-block;
    background-color: #ffd;
    cursor: pointer;
  }

  .filters {
    max-width: 50rem;
    margin: 0 auto;
  }

  .type-filters {
    margin-bottom: 1rem;
    font-size: smaller;
    align-items: center;

    @media (min-width: 500px) {
      display: flex;
    }

    button {
      flex-shrink: 0;
      width: 3rem;
      margin: 1em;
      padding-top: .7em;
      padding-bottom: .7em;
    }

    button:nth-of-type(2) {
      order: 1;
    }
  }

  .type-filters-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: start;
  }

  .filter-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-width: 7em;
    text-transform: capitalize;
    margin: .5em 1vw;
    cursor: pointer;

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
