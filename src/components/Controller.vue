<template>
  <div class="hello">
    <h1>1231223</h1>
    <div
      v-for="dexGroup in pmData"
      :key="dexGroup.index"
    >
      <div
        class="p-dex"
        v-for="p in dexGroup"
        :key="p.templateId"
      >
        <details>
          <summary>
            {{ getPmName(p) }}
          </summary>
          <pre>{{ p }}</pre>
        </details>
      </div>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Controller',
  props: {
    'pm-data': Object,
  },
  methods: {
    getL10n (strings, lang = window.lang) {
      return strings[lang];
    },
    getPmName: function (p) {
      return this.getL10n(p.names);
    },
  },
};
</script>
