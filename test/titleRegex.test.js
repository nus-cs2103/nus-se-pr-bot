const titleRegex = require('../src/utility')._titleRegex;

it('should validate valid titles', () => {
  expect(titleRegex.exec('[W2.2b][W09-A1]James Yong')).not.toBeNull();
  expect(titleRegex.exec('[W2.2b][W09-A1]')).not.toBeNull();
  expect(titleRegex.exec('[W2.2][W09-A1]James Yong')).not.toBeNull();
  expect(titleRegex.exec('[W10.2][W09-A1]James Yong')).not.toBeNull();
});

it('should invalidate invalid titles', () => {
  expect(titleRegex.exec('')).toBeNull();
  expect(titleRegex.exec('W2.2b][W09-A1]')).toBeNull();
  expect(titleRegex.exec('[W2.2]')).toBeNull();
  expect(titleRegex.exec('[W09-A1]')).toBeNull();
  expect(titleRegex.exec('[W10.10][W09-A1]James Yong')).toBeNull();
});

it('should extract classId & teamId from valid titles', () => {
  let result = titleRegex.exec('[W2.2b][W09-A1]James Yong');
  expect(result[1]).toBe('W09');
  expect(result[2]).toBe('1');
});
