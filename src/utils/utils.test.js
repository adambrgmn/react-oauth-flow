import * as utils from './index';

test('utils.buildURL', () => {
  const baseUrl = 'https://www.test.com';

  let url = utils.buildURL(baseUrl, {
    a: 'hello',
    b: 'world',
  });
  expect(url).toEqual(`${baseUrl}?a=hello&b=world`);

  url = utils.buildURL(baseUrl);
  expect(url).toBe(baseUrl);

  url = utils.buildURL(`${baseUrl}?a=hello`, { b: 'world' });
  expect(url).toBe(`${baseUrl}?a=hello&b=world`);
});

test.skip('utils.fetch2', async () => {
  const url = 'https://api.github.com/users/octocat';

  const data = await utils.fetch2(url);
  expect(data.login).toBe('octocat');

  try {
    await utils.fetch2(`${url}/404-endpoint`);
  } catch (err) {
    expect(err.response.ok).toBe(false);
    expect(err.message).toBe('Not Found');
  }
});
