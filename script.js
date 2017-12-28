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
elm.pmCtrlBox.addEventListener('input', throttle((e) => {
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

  updatePmData();
}, 300));

const createPmHTML = (pm) => {
  let index = pm.number - 1;
  let row = ~~(index / colCount);
  let col = index % colCount;
  let {cp, hp} = calPmData(pm);
  let typeHtml = pm.field_pokemon_type.split(', ').map(type => `<div class="pm_type pm_type--${type}"></div>`).join('');
  return `
    <li class="pm"
      data-type="${pm.field_pokemon_type}"
      data-maxcp="${pm.cp}"
      style="
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
        data-atk="${pm.atk}"
        data-def="${pm.def}"
        data-sta="${pm.sta}"
      ></div>
      <div class="pm_types">${typeHtml}</div>
    </li>`;
};

// fetch data
let upstreamUrls = ['pms.json', 'levelMultiplier.json'];
Promise.all(upstreamUrls.map(url => fetch(url).then(toJson)))
.then(datas => {
  let [pms, levelMultiplier] = datas;
  window.pms = pms; // DEBUG
  window.levelMultiplier = levelMultiplier;
  window.colCount = Number(window.getComputedStyle(document.documentElement).getPropertyValue('--sprite-grid-col'))
  let pmTypes = [];
  let html = pms.map(pm => {
    pmTypes = pmTypes.concat(pm.field_pokemon_type.split(', '));
    ['atk', 'def', 'sta'].forEach(i => {
      pm[i] = pm[i] * 1;
    });
    return createPmHTML(pm);
  });
  elm.pmList.innerHTML = html.join('');

  let uniPmTypes = [...new Set(pmTypes)];

  console.log(uniPmTypes);
  console.dir(pms[0]);
  updatePmData();
});

const updatePmData = () => {
  let data = pms.map(pm => {
    let {cp, hp} = calPmData(pm);
    return `--pm-${pm.number}-cp: ${cp}; --pm-${pm.number}-hp: ${hp};`
  });

  elm.pmList.setAttribute('style', data.join(' '));
};
