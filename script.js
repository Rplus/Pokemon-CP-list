if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('service-worker.js');
}

const toJson = (d) => d.json();

const updateIv = (iv = window.iv) => {
  let percentage = ((iv.atk + iv.def + iv.sta) * 100 / 45).toFixed();
  elm.root.style.setProperty('--iv-percentage', percentage);
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

  updatePmData();
});

const createPmHTML = (pm) => {
  let {cp, hp} = calPmData(pm);
  return `
    <li class="pm"
      data-type="${pm.field_pokemon_type}"
      data-maxcp="${pm.cp}"
      style="
        --pm-cp: var(--pm-${pm.number}-cp);
        --pm-hp: var(--pm-${pm.number}-hp);"
    >
      <div class="pm_name">#${pm.number} ${pm.title_1}</div>
      <div class="pm_img"></div>
      <div class="pm_cp" data-max-cp=pm.cp></div>
      <div class="pm_info"
        data-type="${pm.field_pokemon_type}"
        data-atk="${pm.atk}"
        data-def="${pm.def}"
        data-sta="${pm.sta}"
      ></div>
    </li>`;
};

// fetch data
let upstreamUrls = ['pms.json', 'levelMultiplier.json'];
Promise.all(upstreamUrls.map(url => fetch(url).then(toJson)))
.then(datas => {
  let [pms, levelMultiplier] = datas;
  window.pms = pms; // DEBUG
  window.levelMultiplier = levelMultiplier;
  let html = pms.map(pm => {
    ['atk', 'def', 'sta'].forEach(i => {
      pm[i] = pm[i] * 1;
    });
    return createPmHTML(pm);
  });
  elm.pmList.innerHTML = html;

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
