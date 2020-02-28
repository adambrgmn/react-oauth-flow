import qs from 'qs';

it('works', () => {
  expect(qs.parse('#abc=foo', { ignoreQueryPrefix: true })).toEqual({
    abc: 'foo',
  });
});
