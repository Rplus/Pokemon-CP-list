window.lang = navigator.language.slice(0, 2);

// String.prototype.capitalize = function () {
//   return this.charAt(0).toUpperCase() + this.slice(1);
// };

// Number.prototype.clamp = function (min, max) {
//   return Math.min(Math.max(this, min), max);
// };

export default {
  getL10n (strings, lang = window.lang) {
    return strings[lang];
  },

  getPmName (p) {
    return this.getL10n(p.names) || p.pokemonId;
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
