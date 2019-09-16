import pmData from '../data/pm-data-by-dex.json';
import pmName from '../data/pm-name.json';
import levelMultiplier from '../data/level-multiplier.json';
import u from './u.js';

let uniDex = [
  351,
  412,
  421,
  422,
  423,
  493,
];

let genDex = {
  'gen1': [1, 151],
  'gen2': [152, 251],
  'gen3': [252, 386],
  'gen4': [387, 493],
  'gen5': [494, 649],
};

let pmClasses = {};

for (let i in pmData) {
  if (pmData[i].findIndex(pm => pm.templateId.indexOf('_PURIFIED') !== -1) !== -1) {
    pmData[i] = pmData[i].filter(pm => {
      return (
        pm.templateId.indexOf('_PURIFIED') === -1 &&
        pm.templateId.indexOf('_SHADOW') === -1
      );
    });
  }
}


Object.keys(pmData).forEach((dex) => {
  pmData[dex].sort((a, b) => (
    b.templateId.indexOf('NORMAL') - a.templateId.indexOf('NORMAL')
  ));

  pmData[dex] = pmData[dex].filter(pm => {
    pm.uid = `${pm.pokedex}${pm.isotope ? '_' + pm.isotope : ''}`;
    pm.names = pmName[`${pm.pokedex}`.padStart(3, '0')] || {};
    pm.name = u.getPmName(pm);
    let titleSufix = (pm.isotope && pm.isotope !== 'NORMAL') ? `-${pm.isotope.toLowerCase()}` : '';
    pm.title = `${pm.name}${titleSufix}`;
    pm.types = [...new Set(pm.types)];
    pm.class = [...pm.types];
    if (pm.rarity) {
      pm.class.push('POKEMON_TYPE_RARITY');
    }
    if (pm.isotope === 'ALOLA') {
      pm.class.push('POKEMON_TYPE_ALOLA');
    }
    pm.class.forEach(t => (pmClasses[t] = ''));

    if (pmData[dex].length > 1) {
      return (uniDex.indexOf(+dex) !== -1) ? !pm.isotope : pm.isotope;
    }
    return true;
  });
});

pmClasses = (
  Object.keys(pmClasses)
    .sort()
    .map(t => t.replace('POKEMON_TYPE_', '').toLowerCase())
);

const allDex =
  Object.keys(pmData);

const dexMap = (
  allDex
    .reduce((all, dex) => {
      all[dex] = dex;
      return all;
    }, [])
);

const pms = [];

allDex
  .forEach(dex => {
    pmData[dex]
      .forEach(pm => {
        pms.push(pm);
      });
  });

const calPmData = (pm, adsl) => {
  let [a, d, s, l] = adsl;
  let mFactor = levelMultiplier[l];
  let ADS = (pm.stats.baseAttack + a) * Math.pow((pm.stats.baseDefense + d) * (pm.stats.baseStamina + s), 0.5);
  let total = ADS * Math.pow(mFactor, 2.0);

  return {
    cp: Math.max(10, Math.floor(total / 10)),
    hp: Math.max(10, Math.floor((pm.stats.baseStamina + s) * mFactor)),
  };
};

export default {
  pms: pms,
  classes: pmClasses,
  dexMap,
  calPmData: calPmData,
  genDex,
};
