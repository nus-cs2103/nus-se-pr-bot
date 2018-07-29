const Validator = require('../src/Validator');
const titleRegex = require('../src/utility')._titleRegex;
const sinon = require('sinon');
const Accuser = require('accuser');

describe('Validator methods', () => {

  let validator;

  beforeEach(() => {
    const stubAccuser = sinon.createStubInstance(Accuser);
    stubAccuser.addRepository = function() { return { newWorker: sinon.stub() }; };
    validator = new Validator(stubAccuser, 'test', 'testRepo');
  });

  afterEach(() => {
    sinon.restore();
  });

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
      labels: [{ name: 'A' }, { name: 'B' }]
    };

    expect(Validator.hasLabel(mockIssue, 'A')).toBeTruthy();
  });

  it('should show label non existence', () => {
    const mockIssue = {
      labels: [{ name: 'A' }, { name: 'B' }]
    };

    expect(Validator.hasLabel(mockIssue, 'C')).toBeFalsy();
  });

  it('should ignore case sensitivity for checking label existence', () => {
    const mockIssue = {
      labels: [{ name: 'A' }]
    };

    expect(Validator.hasLabel(mockIssue, 'a')).toBeTruthy();
  });

  it('should not warn if label to apply already found', () => {
     const spyAddUniqueLabel = sinon.spy(validator, 'addUniqueLabel');
     const spyComment = sinon.spy(validator, 'comment');

     const issue = {
       labels: [{ name: 'existing' }]
     };

     validator.warn(issue, 'existing', 'testMu', {}, 'logged');
     expect(spyAddUniqueLabel.notCalled).toBeTruthy();
     expect(spyComment.notCalled).toBeTruthy();
  });

  it('should warn if label to apply not found', () => {
    const spyAddUniqueLabel = sinon.spy(validator, 'addUniqueLabel');
    const spyComment = sinon.spy(validator, 'comment');

    const issue = {
      labels: [{ name: 'existing' }]
    };

    validator.warn(issue, 'new', 'testMu', {}, 'logged');
    expect(spyAddUniqueLabel.calledWithExactly(issue, 'new')).toBeTruthy();
    expect(spyAddUniqueLabel.calledOnce).toBeTruthy();
    expect(spyComment.calledWithExactly(issue, 'testMu', {})).toBeTruthy();
    expect(spyComment.calledOnce).toBeTruthy();
  });
});
