<template>
  <div class="pmSortBox sortby section">
    <div class="pmSortGroup" v-for="sortType in sortTypes" :key="sortType">
      <label class="pmSort" :for="`sort-by-${sortType}-▲`" data-anti-dir="▲">{{ sortType }}</label>
      <label class="pmSort" :for="`sort-by-${sortType}-▼`" data-anti-dir="▼">{{ sortType }}</label>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Sortby',
  props: {
    'sort-types': Array,
  },
};
</script>

<style lang="scss">
// sort
.pmSortBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
}

.pmSortGroup {
  position: relative;
}

.pmSort {
  position: relative;
  z-index: calc(1 - var(--activity, 0));
  padding-right: .25em;
  padding-left: .75em;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(#000, .2);
  background-color: #{'rgba(255, 255, 200, var(--activity, 0))'};
  text-transform: uppercase;
  opacity: var(--activity, .3);
  user-select: none;

  &::after {
    content: attr(data-anti-dir);
    opacity: var(--activity, 0);
  }

  + #{&} {
    position: absolute;
    top: 0;
    left: 0;
  }
}

$sort-type: (
  ('sort-by-id-▲' --pm-pokedex 1),
  ('sort-by-id-▼' --pm-pokedex -1),
  ('sort-by-cp-▲' --pm-cp 1),
  ('sort-by-cp-▼' --pm-cp -1),
  ('sort-by-atk-▲' --pm-atk 1),
  ('sort-by-atk-▼' --pm-atk -1),
  ('sort-by-def-▲' --pm-def 1),
  ('sort-by-def-▼' --pm-def -1),
  ('sort-by-sta-▲' --pm-sta 1),
  ('sort-by-sta-▼' --pm-sta -1),
  ('sort-by-tank-▲' --pm-tank 1),
  ('sort-by-tank-▼' --pm-tank -1),
);

%activity-itrm {
  --activity: 1;
}

@each $typeG in $sort-type {
  $type: nth($typeG, 1);
  input[name="sort-by"][id="#{$type}"]:checked {
    ~ .sortby .pmSort[for="#{$type}"] {
      @extend %activity-itrm;
    }

    ~ .pm-list .pm {
      --pm-sort-by: var(#{nth($typeG, 2)});
      --pm-sort-dir: #{nth($typeG, 3)};
    }
  }
}

</style>
