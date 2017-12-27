'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('service-worker.js');
}

var toJson = function toJson(d) {
  return d.json();
};

var updateIv = function updateIv() {
  var iv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.iv;

  var percentage = ((iv.atk + iv.def + iv.sta) * 100 / 45).toFixed();
  elm.root.style.setProperty('--iv-percentage', percentage);
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

  updatePmData();
});

var createPmHTML = function createPmHTML(pm) {
  var _calPmData = calPmData(pm),
      cp = _calPmData.cp,
      hp = _calPmData.hp;

  return '\n    <li class="pm"\n      data-type="' + pm.field_pokemon_type + '"\n      data-maxcp="' + pm.cp + '"\n      style="\n        --pm-cp: var(--pm-' + pm.number + '-cp);\n        --pm-hp: var(--pm-' + pm.number + '-hp);"\n    >\n      <div class="pm_name">#' + pm.number + ' ' + pm.title_1 + '</div>\n      <div class="pm_img"></div>\n      <div class="pm_cp" data-max-cp=pm.cp></div>\n      <div class="pm_info"\n        data-type="' + pm.field_pokemon_type + '"\n        data-atk="' + pm.atk + '"\n        data-def="' + pm.def + '"\n        data-sta="' + pm.sta + '"\n      ></div>\n    </li>';
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
  var html = pms.map(function (pm) {
    ['atk', 'def', 'sta'].forEach(function (i) {
      pm[i] = pm[i] * 1;
    });
    return createPmHTML(pm);
  });
  elm.pmList.innerHTML = html;

  console.dir(pms[0]);
  updatePmData();
});

var updatePmData = function updatePmData() {
  var data = pms.map(function (pm) {
    var _calPmData2 = calPmData(pm),
        cp = _calPmData2.cp,
        hp = _calPmData2.hp;

    return '--pm-' + pm.number + '-cp: ' + cp + '; --pm-' + pm.number + '-hp: ' + hp + ';';
  });

  elm.pmList.setAttribute('style', data.join(' '));
};
//# sourceMappingURL=script-dist.js.map