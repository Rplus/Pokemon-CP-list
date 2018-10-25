import pmData from '../pm-data-by-dex.json';
import pmName from '../pm-name.json';

console.log({ pmData, pmName });

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

Object.keys(pmData).forEach((dex) => {
  let _pmWithDex = pmData[dex];

  _pmWithDex.forEach(pm => {
    pm.names = getPmName(pm);
  });

  if (_pmWithDex.length > 2 && !pmData.filted) {
    let pm1 = _pmWithDex[0];

    if (uniDex.includes(pm1.pokedex)) {
      pmData[dex] = [pm1];
    } else {
      pmData[dex].shift();
      pmData[dex].sort((a, b) => {
        return b.templateId.indexOf('NORMAL') - a.templateId.indexOf('NORMAL');
      });
    }
  }
});

pmData.filted = true;

export default {
  pm: pmData,
};
