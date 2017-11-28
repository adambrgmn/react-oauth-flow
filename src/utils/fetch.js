export async function fetch(url, opts) {
  try {
    const res = await window.fetch(url, opts);

    if (res.status < 200 || res.status > 299) {
      throw new Error(res.statusText);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    throw error;
  }
}
