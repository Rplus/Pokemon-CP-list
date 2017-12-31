'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('service-worker.js');
}

var toJson = function toJson(d) {
  return d.json();
};

// src: http://hackll.com/2015/11/19/debounce-and-throttle/
var throttle = function throttle(fn) {
  var threshhold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;

  var last = void 0;
  var timer = void 0;

  return function () {
    var context = this;
    var args = arguments;

    var now = +new Date();

    if (last && now < last + threshhold) {
      clearTimeout(timer);

      timer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};

var updateIv = function updateIv() {
  var iv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.iv;

  var percentage = ((iv.atk + iv.def + iv.sta) * 100 / 45).toFixed();
  elm.pmCtrlBox.style.setProperty('--iv-percentage', percentage);
};

var calPmData = function calPmData(pm) {
  var iv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.iv;
  var lv = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.lv;

  var mFactor = levelMultiplier[lv];
  var ADS = (pm.atk + iv.atk) * Math.pow((pm.def + iv.def) * (pm.sta + iv.sta), 0.5);
  var total = ADS * Math.pow(mFactor, 2.0);
  return {
    cp: Math.floor(total / 10),
    hp: Math.floor((pm.sta + iv.sta) * mFactor)
  };
};

var elm = {
  root: document.documentElement,
  pmCtrlBox: document.querySelector('.pmCtrlBox'),
  pmList: document.querySelector('.pmList'),
  pmFilter: document.querySelector('.pmFilter'),
  pmCustomStyle: document.querySelector('.pmCustomStyle'),
  'pmLv': document.querySelector('#pmLv'),
  'pmLv--range': document.querySelector('#pmLv--range')
};

window.iv = { atk: 0, def: 0, sta: 0 };
window.lv = elm.pmLv.value * 1;

['atk', 'def', 'sta'].forEach(function (i) {
  elm['iv-' + i] = document.querySelector('#iv-' + i);
  elm['iv-' + i + '--range'] = document.querySelector('#iv-' + i + '--range');
  window.iv[i] = elm['iv-' + i].value * 1;
});

updateIv();

// change data
elm.pmCtrlBox.addEventListener('input', function (e) {
  var _target = e.target;
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

var createPmHTML = function createPmHTML(pm) {
  var index = pm.number - 1;
  var row = ~~(index / colCount);
  var col = index % colCount;

  var _calPmData = calPmData(pm),
      cp = _calPmData.cp,
      hp = _calPmData.hp;

  var typeHtml = pm.field_pokemon_type.split(', ').map(function (type) {
    return '<div class="pm_type pm_type--' + type + '"></div>';
  }).join('');
  return '\n    <li class="pm"\n      data-type="' + pm.field_pokemon_type + '"\n      data-maxcp="' + pm.cp + '"\n      style="\n        --pm-pokedex: ' + pm.number * 1 + ';\n        --pm-atk: ' + pm.atk + ';\n        --pm-def: ' + pm.def + ';\n        --pm-sta: ' + pm.sta + ';\n        --pm-col: ' + col + ';\n        --pm-row: ' + row + ';\n        --pm-cp: var(--pm-' + pm.number + '-cp);\n        --pm-hp: var(--pm-' + pm.number + '-hp);"\n    >\n      <div class="pm_name" data-podex=' + pm.number + '>' + pm.title_1 + '</div>\n      <div class="pm_img"></div>\n      <div class="pm_cp" data-max-cp=pm.cp></div>\n      <div class="pm_info"\n        data-type="' + pm.field_pokemon_type + '"\n        data-hp="' + hp + '"\n        data-atk="' + pm.atk + '"\n        data-def="' + pm.def + '"\n        data-sta="' + pm.sta + '"\n      ></div>\n      <div class="pm_types">' + typeHtml + '</div>\n    </li>';
};

var createFilter = function createFilter() {
  var typeFilter__checkbox = [];
  var typeFilter__label = [];
  var types = ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy'];

  return types.reduce(function (obj, type) {
    var _checkboxHtml = '<input type="checkbox" id="ck-' + type + '" value="' + type + '" class="pmFilter__checkbox sr-only ck-' + type + '" checked>';

    var _labelHtml = '<label for="ck-' + type + '" class="pmFilter__label" style="--bgi: var(--type-bgi--' + type + '">' + type + '</label>';

    obj.checkbox.push(_checkboxHtml);
    obj.label.push(_labelHtml);
    return obj;
  }, { checkbox: [], label: [] });
};

var getTemplateHtml = function getTemplateHtml(selector) {
  return document.querySelector(selector).innerHTML;
};

// fetch data
var upstreamUrls = ['pms.json', 'levelMultiplier.json'];
Promise.all(upstreamUrls.map(function (url) {
  return fetch(url).then(toJson);
})).then(function (datas) {
  var _datas = _slicedToArray(datas, 2),
      pms = _datas[0],
      levelMultiplier = _datas[1];

  window.pms = pms; // DEBUG
  window.levelMultiplier = levelMultiplier;
  window.colCount = Number(window.getComputedStyle(document.documentElement).getPropertyValue('--sprite-grid-col'));

  var pmHtml = pms.map(function (pm) {
    ['atk', 'def', 'sta'].forEach(function (i) {
      pm[i] = pm[i] * 1;
    });
    return createPmHTML(pm);
  });
  elm.pmList.innerHTML += pmHtml.join('');

  // filters
  var filterHtml = createFilter();
  elm.pmCtrlBox.insertAdjacentHTML('beforebegin', filterHtml.checkbox.join(''));
  elm.pmFilter.innerHTML = getTemplateHtml('.pmFilter__header--temp') + filterHtml.label.join('');
  elm.pmFilter.addEventListener('click', function (e) {
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

var updatePokedexFilter = function updatePokedexFilter() {
  var pokedexFilter = [elm.pokedexRange1.value, elm.pokedexRange2.value].map(Number);
  var _pokedex = [].concat(_toConsumableArray(pokedexFilter)).sort(function (a, b) {
    return a - b;
  });
  elm.pokedexRangeStyle.textContent = '\n    .pokedexRange {\n      --pokedex-range1: ' + pokedexFilter[0] + ';\n      --pokedex-range2: ' + pokedexFilter[1] + ';\n    }\n\n    .pm:not(:nth-of-type(n + ' + _pokedex[0] + ')),\n    .pm:nth-of-type(n + ' + (_pokedex[1] + 1) + ') {\n      display: none!important;\n    }\n  ';
};

var updataTypeChecbox = function updataTypeChecbox(value) {
  elm.pmTypeCheckboxs.forEach(function (checkbox) {
    checkbox.checked = value;
  });
};

var updatePmData = function updatePmData() {
  var data = pms.map(function (pm) {
    var _calPmData2 = calPmData(pm),
        cp = _calPmData2.cp,
        hp = _calPmData2.hp;

    return '--pm-' + pm.number + '-cp: ' + cp + '; --pm-' + pm.number + '-hp: ' + hp + ';';
  });

  elm.pmCustomStyle.textContent = '.pmList {' + data.join(' ') + '}';
};
//# sourceMappingURL=script-dist.js.map