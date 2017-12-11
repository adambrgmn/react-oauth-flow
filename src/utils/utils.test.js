import nock from 'nock';
import * as utils from './index';

beforeAll(() => {
  const api = nock('https://api.github.com/');

  api.get('/users/octocat').reply(200, {
    login: 'octocat',
  });

  api.get('/users/404').reply(404, {
    message: 'User 404 not found',
  });
});

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

test('utils.fetch2', async () => {
  const data = await utils.fetch2('https://api.github.com/users/octocat');
  expect(data.login).toBe('octocat');

  try {
    await utils.fetch2('https://api.github.com/users/404');
    expect(true).toBe(false);
  } catch (err) {
    expect(err.response.ok).toBe(false);
    expect(err.message).toBe('Not Found');
  }
});
