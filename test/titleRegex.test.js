const titleRegex = require('../src/utility')._titleRegex;

it('should validate valid titles', () => {
  expect(titleRegex.test('[W2.2b][W09-A1]James Yong')).toBeTruthy();
  expect(titleRegex.test('[W2.2b][W09-A1]')).toBeTruthy();
  expect(titleRegex.test('[W2.2][W09-A1]James Yong')).toBeTruthy();
  expect(titleRegex.test('[W10.2][W09-A1]James Yong')).toBeTruthy();
  expect(titleRegex.test('[W10.10][W09-A1]James Yong')).toBeTruthy();
});

it('should invalidate invalid titles', () => {
  expect(titleRegex.test('Learning Outcome 1')).toBeFalsy();
  expect(titleRegex.test('W2.2b][W09-A1]')).toBeFalsy();
  expect(titleRegex.test('[W2.2]')).toBeFalsy();
  expect(titleRegex.test('[W09-A1]')).toBeFalsy();
});

it('should extract classId & teamId from valid titles', () => {
  let result = titleRegex.exec('[W2.2b][W09-A1]James Yong');
  expect(result[1]).toBe('W09');
  expect(result[2]).toBe('A');
  expect(result[3]).toBe('1');
});
