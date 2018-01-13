if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

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

const updateIv = (iv = window.ctrl.iv) => {
  let percentage = ((iv.atk + iv.def + iv.sta) * 100 / 45).toFixed();
  elm.pmCtrlBox.style.setProperty('--iv-percentage', percentage);
};

const calPmData = (pm, iv = window.ctrl.iv, lv = window.ctrl.lv) => {
  let mFactor = levelMultiplier[lv];
  let ADS = (pm.atk + iv.atk) * Math.pow((pm.def + iv.def) * (pm.sta + iv.sta), 0.5);
  let total = ADS * Math.pow(mFactor, 2.0);
  return {
    cp: Math.floor(total / 10),
    hp: Math.floor((pm.sta + iv.sta) * mFactor)
  };
};

window.elm = {
  root: document.documentElement,
  pmCtrlBox: $('.pmCtrlBox'),
  pmList: $('.pmList'),
  pmFilter: $('.pmFilter'),
  pmCustomStyle: $('.pmCustomStyle'),
  'pmLv': $('#pmLv'),
  'pmLv--range': $('#pmLv--range'),
};

window.ctrl = {
  iv: { atk: 0, def: 0, sta: 0 },
  lv: elm.pmLv.value * 1,
};

['atk', 'def', 'sta'].forEach(i => {
  elm[`iv-${i}`] = $(`#iv-${i}`);
  elm[`iv-${i}--range`] = $(`#iv-${i}--range`);
  window.ctrl.iv[i] = elm[`iv-${i}`].value * 1;
});

// change data
elm.pmCtrlBox.addEventListener('input', (e) => {
  let _target = e.target;
  if (_target.dataset.sync) {
    elm[_target.dataset.sync].value = _target.value;
  }
  if (_target.dataset.update === 'iv') {
    window.ctrl.iv[_target.dataset.type] = _target.value * 1;
    updateIv();
  } else if (_target.dataset.update === 'lv') {
    window.ctrl.lv = _target.value * 1;
  }

  throttle(updatePmData, 500)();
});

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

  // init sort-by value
  $('[name="sort-by"]').checked = true;

  initTypeFilter();
  initPokedexFilter();

  updateIv();
  updatePmData();
  updatePokedexFilter();
});

const getTemplateHtml = (selector) => {
  return $(selector).innerHTML;
};

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
      data-type="${[pm.field_pokemon_type, pm.pokemon_class && pm.pokemon_class !== 'Normal' && 'Legendary'].join(', ')}"
      data-maxcp="${pm.cp}"
      style="
        --pm-pokedex: ${pm.number};
        --pm-atk: ${pm.atk};
        --pm-def: ${pm.def};
        --pm-sta: ${pm.sta};
        --pm-tank: ${pm.tank};
        --pm-col: ${col};
        --pm-row: ${row};
        --pm-cp: var(--pm-${pm.number}-cp);
        --pm-hp: var(--pm-${pm.number}-hp);"
    >
      <div class="pm_name" data-podex=${pm.number} title="${pm.title.match(/[^>]+\>([^<]+)/)[1]}">${pm.title_1}</div>
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
  let types = ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy', 'Legendary'];

  return types.reduce((obj, type) => {
    let _checkboxHtml = `<input type="checkbox" id="ck-${type}" value="${type}" class="pmFilter__checkbox sr-only ck-${type}" ${type === 'Legendary' ? 'checked': ''}>`;

    let _labelHtml = `<label for="ck-${type}" class="pmFilter__label" style="--bgi: var(--type-bgi--${type}">${type}</label>`;

    obj.checkbox.push(_checkboxHtml);
    obj.label.push(_labelHtml);
    return obj;
  }, { checkbox: [], label: [] });
};

const initTypeFilter = () => {
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
  elm.pmTypeCheckboxs = $$('.pmFilter__checkbox');
};

const initPokedexFilter = () => {
  elm.pmCtrlBox.insertAdjacentHTML('beforeend', getTemplateHtml('.pokedexRange--temp'));

  elm.pokedexRange = $('.pokedexRange');
  elm.pokedexRange1 = $('#pokedexRange1');
  elm.pokedexRange2 = $('#pokedexRange2');
  elm.pokedexRangeStyle = $('style');
  elm.pokedexRange.addEventListener('input', updatePokedexFilter);

  // init pokedex filter value
  elm.pokedexRange1.value = elm.pokedexRange1.min;
  elm.pokedexRange1.max = pms.length;
  elm.pokedexRange2.max = pms.length;
  elm.pokedexRange2.value = pms.length;
};

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
