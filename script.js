if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('service-worker.js');
}

const toJson = (d) => d.json();

// src: http://hackll.com/2015/11/19/debounce-and-throttle/
const throttle = (fn, threshhold = 250) => {
  let last;
  let timer;

  return function() {
    let context = this;
    let args = arguments;

    let now = +new Date();

    if (last && now < last + threshhold) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  }
};

const updateIv = (iv = window.iv) => {
  let percentage = ((iv.atk + iv.def + iv.sta) * 100 / 45).toFixed();
  elm.pmCtrlBox.style.setProperty('--iv-percentage', percentage);
};

const calPmData = (pm, iv = window.iv, lv = window.lv) => {
  let mFactor = levelMultiplier[lv];
  let ADS = (pm.atk + iv.atk) * Math.pow((pm.def + iv.def) * (pm.sta + iv.sta), 0.5);
  let total = ADS * Math.pow(mFactor, 2.0);
  return {
    cp: Math.floor(total / 10),
    hp: Math.floor((pm.sta + iv.sta) * mFactor)
  };
};

const elm = {
  root: document.documentElement,
  pmCtrlBox: document.querySelector('.pmCtrlBox'),
  pmList: document.querySelector('.pmList'),
  pmFilter: document.querySelector('.pmFilter'),
  pmCustomStyle: document.querySelector('.pmCustomStyle'),
  'pmLv': document.querySelector('#pmLv'),
  'pmLv--range': document.querySelector('#pmLv--range'),
};

window.iv = { atk: 0, def: 0, sta: 0 };
window.lv = elm.pmLv.value * 1;

['atk', 'def', 'sta'].forEach(i => {
  elm[`iv-${i}`] = document.querySelector(`#iv-${i}`);
  elm[`iv-${i}--range`] = document.querySelector(`#iv-${i}--range`);
  window.iv[i] = elm[`iv-${i}`].value * 1;
});

updateIv();

// change data
elm.pmCtrlBox.addEventListener('input', (e) => {
  let _target = e.target;
  if (_target.dataset.sync) {
    elm[_target.dataset.sync].value = _target.value;
  }
  if (_target.dataset.update === 'iv') {
    window.iv[_target.dataset.type] = _target.value * 1;
    updateIv();
  } else if (_target.dataset.update === 'lv') {
    window.lv = _target.value * 1;
  }

  // throttle(setTimeout(updatePmData, 60), 500)();
  throttle(updatePmData, 500)();
});

const createPmHTML = (pm) => {
  let index = pm.number - 1;
  let row = ~~(index / colCount);
  let col = index % colCount;
  let {cp, hp} = calPmData(pm);
  let typeHtml = pm.field_pokemon_type.split(', ').map(type => `<div class="pm_type pm_type--${type}"></div>`).join('');
  pm.hp = hp;
  pm.tank = pm.sta * pm.def;
  return `
    <li class="pm"
      data-type="${pm.field_pokemon_type}"
      data-maxcp="${pm.cp}"
      style="
        --pm-pokedex: ${pm.number * 1};
        --pm-atk: ${pm.atk};
        --pm-def: ${pm.def};
        --pm-sta: ${pm.sta};
        --pm-tank: ${pm.tank};
        --pm-col: ${col};
        --pm-row: ${row};
        --pm-cp: var(--pm-${pm.number}-cp);
        --pm-hp: var(--pm-${pm.number}-hp);"
    >
      <div class="pm_name" data-podex=${pm.number}>${pm.title_1}</div>
      <div class="pm_img"></div>
      <div class="pm_cp" data-max-cp=pm.cp></div>
      <div class="pm_info"
        data-type="${pm.field_pokemon_type}"
        data-hp="${hp}"
        data-atk="${pm.atk}"
        data-def="${pm.def}"
        data-sta="${pm.sta}"
      ></div>
      <div class="pm_types">${typeHtml}</div>
    </li>`;
};

const createFilter = () => {
  let typeFilter__checkbox = [];
  let typeFilter__label =[];
  let types = ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy'];

  return types.reduce((obj, type) => {
    let _checkboxHtml = `<input type="checkbox" id="ck-${type}" value="${type}" class="pmFilter__checkbox sr-only ck-${type}" checked>`;

    let _labelHtml = `<label for="ck-${type}" class="pmFilter__label" style="--bgi: var(--type-bgi--${type}">${type}</label>`;

    obj.checkbox.push(_checkboxHtml);
    obj.label.push(_labelHtml);
    return obj;
  }, { checkbox: [], label: [] });
};

const getTemplateHtml = (selector) => {
  return document.querySelector(selector).innerHTML;
};

// fetch data
let upstreamUrls = ['pms.json', 'levelMultiplier.json'];
Promise.all(upstreamUrls.map(url => fetch(url).then(toJson)))
.then(datas => {
  let [pms, levelMultiplier] = datas;
  window.pms = pms; // DEBUG
  window.levelMultiplier = levelMultiplier;
  window.colCount = Number(window.getComputedStyle(document.documentElement).getPropertyValue('--sprite-grid-col'))

  let pmHtml = pms.map(pm => {
    ['atk', 'def', 'sta'].forEach(i => {
      pm[i] = pm[i] * 1;
    });
    return createPmHTML(pm);
  });
  elm.pmList.innerHTML += pmHtml.join('');

  // filters
  let filterHtml = createFilter();
  elm.pmCtrlBox.insertAdjacentHTML('beforebegin', filterHtml.checkbox.join(''));
  elm.pmFilter.innerHTML = getTemplateHtml('.pmFilter__header--temp') + filterHtml.label.join('');
  elm.pmFilter.addEventListener('click', (e) => {
    if (e.target.dataset.hook === 'js') {
      e.preventDefault();
      updataTypeChecbox(e.target.dataset.type === 'none' ? false : true);
    }
  });
  elm.pmTypeCheckboxs = document.querySelectorAll('.pmFilter__checkbox');

  document.querySelector('[name="sort-by"]').checked = true;

  // pokedex filter
  elm.pmCtrlBox.insertAdjacentHTML('beforeend', getTemplateHtml('.pokedexRange--temp'));

  elm.pokedexRange = document.querySelector('.pokedexRange');
  elm.pokedexRange1 = elm.pokedexRange.querySelector('#pokedexRange1');
  elm.pokedexRange2 = elm.pokedexRange.querySelector('#pokedexRange2');
  elm.pokedexRangeStyle = elm.pokedexRange.querySelector('style');
  elm.pokedexRange.addEventListener('input', updatePokedexFilter);

  // pokedex filter init
  elm.pokedexRange1.value = elm.pokedexRange1.min;
  elm.pokedexRange1.max = pms.length;
  elm.pokedexRange2.max = pms.length;
  elm.pokedexRange2.value = pms.length;

  updatePmData();
  updatePokedexFilter();

});

const updatePokedexFilter = () => {
  let pokedexFilter = [
    elm.pokedexRange1.value,
    elm.pokedexRange2.value
  ].map(Number);
  let _pokedex = [...pokedexFilter].sort((a, b) => a - b);
  elm.pokedexRangeStyle.textContent = `
    .pokedexRange {
      --pokedex-range1: ${pokedexFilter[0]};
      --pokedex-range2: ${pokedexFilter[1]};
    }

    .pm:not(:nth-of-type(n + ${_pokedex[0]})),
    .pm:nth-of-type(n + ${_pokedex[1] + 1}) {
      display: none!important;
    }
  `;
};

const updataTypeChecbox = (value) => {
  elm.pmTypeCheckboxs.forEach(checkbox => {
    checkbox.checked = value;
  });
};

const updatePmData = () => {
  let data = pms.map(pm => {
    let {cp, hp} = calPmData(pm);
    return `--pm-${pm.number}-cp: ${cp}; --pm-${pm.number}-hp: ${hp};`
  });

  elm.pmCustomStyle.textContent = `.pmList {${data.join(' ')}}`;
};
