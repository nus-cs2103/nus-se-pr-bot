const Validator = require('../src/Validator');
const titleRegex = require('../src/utility')._titleRegex;

it('should validate valid titles', () => {
  const testTitle = Validator.testTitle;
  expect(testTitle('[W2.2b][W09-A1]James Yong', titleRegex)).toBeTruthy();
  expect(testTitle('[W2.2b][W09-A1]', titleRegex)).toBeTruthy();
  expect(testTitle('[W2.2][W09-A1]James Yong', titleRegex)).toBeTruthy();
  expect(testTitle('[W10.2][W09-A1]James Yong', titleRegex)).toBeTruthy();
  expect(testTitle('[W10.10][W09-A1]James Yong', titleRegex)).toBeTruthy();
});

it('should validate titles with intersparsed whitespaces', () => {
  const testTitle = Validator.testTitle;
  expect(testTitle(' [W2.2b][W09-A1]James Yong', titleRegex)).toBeTruthy();
  expect(testTitle('  [W2.2b][W09-A1]James Yong', titleRegex)).toBeTruthy();
  expect(testTitle('[W2.2b] [W09-A1]James Yong', titleRegex)).toBeTruthy();
  expect(testTitle('[W2.2b]  [W09-A1]James Yong', titleRegex)).toBeTruthy();
  expect(testTitle('[W2.2b][W09-A1] James Yong', titleRegex)).toBeTruthy();
  expect(testTitle('[W2.2b][W09-A1]James Yong ', titleRegex)).toBeTruthy();
});

it('should invalidate invalid titles', () => {
  const testTitle = Validator.testTitle;
  expect(testTitle('Learning Outcome 1', titleRegex)).toBeFalsy();
  expect(testTitle('W2.2b][W09-A1]', titleRegex)).toBeFalsy();
  expect(testTitle('[W2.2]', titleRegex)).toBeFalsy();
  expect(testTitle('[W09-A1]', titleRegex)).toBeFalsy();
  expect(testTitle('[W2.2ab][W09-A1]James Yong', titleRegex)).toBeFalsy();
});

it('should extract classId & teamId from valid titles', () => {
  let result = Validator.checkTitle('[W2.2b][W09-A1]James Yong', titleRegex);
  expect(result[1]).toBe('W09');
  expect(result[2]).toBe('A');
  expect(result[3]).toBe('1');
});
