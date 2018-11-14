export default {
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

    history.pushState(null, null, `?${search.toString()}`);
  },

  getPara (para) {
    let search = new URLSearchParams(location.search);
    let value = search.get(para);
    if (value) {
      return value.split(this.spliter);
    } else {
      return null;
    }
  },
};
