import pmData from '../data/pm-data-by-dex.json';
import pmName from '../data/pm-name.json';
import levelMultiplier from '../data/level-multiplier.json';

let uniDex = [
  351,
  421,
  422,
  423,
  493,
];

let getPmName = (pm = 1, lang) => {
  let dex = `${pm.pokedex}`.padStart(3, '0');
  return (lang ? pmName[dex][lang] : pmName[dex]) || pm.pokemonId;
};

let pmTypes = {};

Object.keys(pmData).forEach((dex) => {
  pmData[dex].sort((a, b) => (
    b.templateId.indexOf('NORMAL') - a.templateId.indexOf('NORMAL')
  ));

  pmData[dex] = pmData[dex].filter(pm => {
    pm.uid = `${pm.pokedex}${pm.isotope ? '_' + pm.isotope : ''}`;
    pm.names = getPmName(pm);
    if (pm.rarity) {
      pm.types.push('POKEMON_TYPE_RARITY');
    }
    if (pm.isotope === 'ALOLA') {
      pm.types.push('POKEMON_TYPE_ALOLA');
    }
    pm.types.forEach(t => (pmTypes[t] = ''));

    if (pmData[dex].length > 1) {
      // console.log(pm.templateId);
      return (uniDex.indexOf(+dex) !== -1) ? !pm.isotope : pm.isotope;
    }
    return true;
  });
});

pmTypes = (
  Object.keys(pmTypes)
    .sort()
    .map(t => t.replace('POKEMON_TYPE_', '').toLowerCase())
);

const dexMap = (
  Object.keys(pmData)
    .reduce((all, dex) => {
      all[dex] = dex;
      return all;
    }, [])
);

const pms = [];

Object.keys(pmData).forEach(dex => {
  pmData[dex].forEach(pm => {
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
  types: pmTypes,
  dexMap,
  calPmData: calPmData,
  genDex: {
    'gen1': [1, 151],
    'gen2': [152, 251],
    'gen3': [252, 386],
    'gen4': [387, 493],
  },
};
