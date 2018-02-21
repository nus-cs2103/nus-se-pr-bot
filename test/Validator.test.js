const Validator = require('../src/Validator');
const titleRegex = require('../src/utility')._titleRegex;

describe('Validator methods', () => {
  it('should validate valid titles', () => {
    const testTitle = Validator.testTitle;
    expect(testTitle('[W2.2b][W09-A1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W2.2b][W09-A1]', titleRegex)).toBeTruthy();
    expect(testTitle('[W2.2][W09-A1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W10.2][W09-A1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W10.10][W09-A1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[v1.2][W09-A1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[V1.0][W09-A1]James Yong', titleRegex)).toBeTruthy();
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
    expect(testTitle('[1.1][W09-A1]', titleRegex)).toBeFalsy();
    expect(testTitle('[v1.10][W09-A1]', titleRegex)).toBeFalsy();
    expect(testTitle('[W2.2ab][W09-A1]James Yong', titleRegex)).toBeFalsy();
  });

  it('should extract classId & teamId from valid titles', () => {
    let result = Validator.checkTitle('[W2.2b][W09-A1]James Yong', titleRegex);
    expect(result[1]).toBe('W2.2b');
    expect(result[2]).toBe('W09');
    expect(result[3]).toBe('A');
    expect(result[4]).toBe('1');
  });

  it('should show label existence', () => {
    const mockIssue = {
      labels: [{ name: 'A'}, {name: 'B'}]
    }

    expect(Validator.hasLabel(mockIssue, 'A')).toBeTruthy();
  });

  it('should show label non existence', () => {
    const mockIssue = {
      labels: [{ name: 'A'}, {name: 'B'}]
    }

    expect(Validator.hasLabel(mockIssue, 'C')).toBeFalsy();
  });

  it('should ignore case sensitivity for checking label existence', () => {
    const mockIssue = {
      labels: [{ name: 'A'}]
    }

    expect(Validator.hasLabel(mockIssue, 'a')).toBeTruthy();
  });
});
