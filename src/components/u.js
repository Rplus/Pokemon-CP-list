export default {
  getL10n (strings, lang = window.lang) {
    return strings[lang];
  },

  getPmName (p) {
    return this.getL10n(p.names);
  },

  range (start, end) {
    return [ ...Array(end - start + 1).keys() ].map(i => i + start);
  },

  round (number) {
    return Math.round(number * 100);
  },

  flatten (arr) {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
    }, []);
  },
};
