export function fetch(url, opts) {
  return window.fetch(url, opts).then(res => {
    if (res.status < 200 || res.status > 299) {
      throw new Error(res.statusText);
    }

    return res.json();
  });
}
