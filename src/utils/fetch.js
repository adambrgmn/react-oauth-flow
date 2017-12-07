export function fetch(url, opts) {
  return window.fetch(url, opts).then(res => {
    if (res.status < 200 || res.status > 299) {
      const err = new Error(res.statusText);
      err.response = res;
      throw err;
    }

    return res.json();
  });
}
