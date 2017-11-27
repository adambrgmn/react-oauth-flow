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
