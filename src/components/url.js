export default {
  urls: [],
  spliter: '-',

  search (state) {
    let search = new URLSearchParams(location.search);
    if (!state) {
      return search;
    }

    for (let i in state) {
      if (state[i]) {
        search.set(i, state[i]);
      } else {
        search.delete(i);
      }
    }

    this.updateUrl(`?${search.toString()}`);
  },

  updateUrl (searchString) {
    this.urls.push(searchString);
    if (this.timer) {
      return;
    }
    this.timer = setTimeout(this.pushLatestUrl.bind(this), 500);
  },

  pushLatestUrl () {
    let latestUrl = this.urls[this.urls.length - 1];
    history.pushState(null, null, latestUrl);

    clearTimeout(this.timer);
    this.timer = null;
    this.urls = [];
  },

  getPara (para, split = true) {
    let search = new URLSearchParams(location.search);
    let value = search.get(para);
    if (value) {
      return split ? value.split(this.spliter) : value;
    } else {
      return null;
    }
  },
};
