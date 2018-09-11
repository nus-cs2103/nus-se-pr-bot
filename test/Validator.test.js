const Validator = require('../src/Validator');
const titleRegex = require('../src/utility')._titleRegex;
const sinon = require('sinon');
const Accuser = require('accuser');

describe('Validator methods', () => {
  let validator;

  beforeEach(() => {
    const stubAccuser = sinon.createStubInstance(Accuser);
    stubAccuser.addRepository = function () { return { newWorker: sinon.stub() }; };
    validator = new Validator(stubAccuser, 'test', 'testRepo');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should validate valid titles', () => {
    const testTitle = Validator.testTitle;
    expect(testTitle('[W2.2b][W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W2.2][W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W10.2][W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W10.10][W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[v1.2][W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[V1.0][W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[T09-2] Contact List Pro', titleRegex)).toBeTruthy();
  });

  it('should validate titles with intersparsed whitespaces', () => {
    const testTitle = Validator.testTitle;
    expect(testTitle(' [W2.2b][W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('  [W2.2b][W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W2.2b] [W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W2.2b]  [W09-1]James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W2.2b][W09-1] James Yong', titleRegex)).toBeTruthy();
    expect(testTitle('[W2.2b][W09-1]James Yong ', titleRegex)).toBeTruthy();
  });

  it('should invalidate title with phases', () => {
    const testTitle = Validator.testTitle;
    expect(testTitle(' [W2.2b][W09-A1]James Yong', titleRegex)).toBeFalsy();
    expect(testTitle('  [W2.2b][W09-A1]James Yong', titleRegex)).toBeFalsy();
    expect(testTitle('[W2.2b] [W09-A1]James Yong', titleRegex)).toBeFalsy();
    expect(testTitle('[W2.2b]  [W09-B1]James Yong', titleRegex)).toBeFalsy();
    expect(testTitle('[W2.2b][W09-B1] James Yong', titleRegex)).toBeFalsy();
    expect(testTitle('[W2.2b][W09-B1]James Yong ', titleRegex)).toBeFalsy();
  });

  it('should invalidate invalid titles', () => {
    const testTitle = Validator.testTitle;
    expect(testTitle('[W2.2b][W09-1]', titleRegex)).toBeFalsy();
    expect(testTitle('Learning Outcome 1', titleRegex)).toBeFalsy();
    expect(testTitle('W2.2b][W09-1]', titleRegex)).toBeFalsy();
    expect(testTitle('[W2.2]', titleRegex)).toBeFalsy();
    expect(testTitle('[W09-1]', titleRegex)).toBeFalsy();
    expect(testTitle('[1.1][W09-1]', titleRegex)).toBeFalsy();
    expect(testTitle('[v1.10][W09-1]', titleRegex)).toBeFalsy();
    expect(testTitle('[W2.2ab][W09-1]James Yong', titleRegex)).toBeFalsy();
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
    const mockAddUniqueLabel = sinon.stub(validator, 'addUniqueLabel');
    const mockComment = sinon.stub(validator, 'comment');

    const issue = {
      labels: [{ name: 'existing' }]
    };

    validator.warn(issue, 'existing', 'testMu', {}, 'logged');
    expect(mockAddUniqueLabel.notCalled).toBeTruthy();
    expect(mockComment.notCalled).toBeTruthy();
  });

  it('should warn if label to apply not found', () => {
    const mockAddUniqueLabel = sinon.stub(validator, 'addUniqueLabel');
    const mockComment = sinon.stub(validator, 'comment');

    const issue = {
      labels: [{ name: 'existing' }]
    };

    validator.warn(issue, 'new', 'testMu', {}, 'logged');
    expect(mockAddUniqueLabel.calledWithExactly(issue, 'new')).toBeTruthy();
    expect(mockAddUniqueLabel.calledOnce).toBeTruthy();
    expect(mockComment.calledWithExactly(issue, 'testMu', {})).toBeTruthy();
    expect(mockComment.calledOnce).toBeTruthy();
  });
});
