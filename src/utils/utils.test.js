import * as utils from './index';

test('utils.buildURL', () => {
  const baseUrl = 'https://www.test.com';

  expect(utils.buildURL(baseUrl, {
    a: 'hello',
    b: 'world',
  })).toEqual(`${baseUrl}?a=hello&b=world`);

  expect(utils.buildURL(baseUrl)).toBe(baseUrl);
  expect(utils.buildURL(`${baseUrl}?a=hello`, { b: 'world' })).toBe(`${baseUrl}?a=hello&b=world`);
  expect(utils.buildURL(baseUrl, {})).toBe(baseUrl);
});
