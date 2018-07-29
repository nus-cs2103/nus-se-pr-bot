const Validator = require('../src/Validator');
const Blacklist = require('../src/Blacklist');
const Greylist = require('../src/Greylist');
const Whitelist = require('../src/Whitelist');
const StudentMapping = require('../src/StudentMapping');
const sinon = require('sinon');
const config = require('../config');

describe('Repository methods', () => {
  let validator;

  beforeEach(() => {
    validator = sinon.createStubInstance(Validator);
  });

  afterEach(() => {
    sinon.restore();
  });

  const executeMockRun = (klass, repo, issue, phaseMappings) => {
    Object.defineProperty(validator, 'doBlock', {
      set: block => block(repo, issue)
    });
    Object.defineProperty(validator, 'filterBlock', {
      set: filter => expect(filter(repo, issue)).toBeTruthy()
    });

    const listItem = new klass({}, '', '', validator, phaseMappings);
    listItem.run();
  };

  it('Blacklist should comment and close', () => {
    const mockIssue = { pull_request: {} };
    executeMockRun(Blacklist, {}, mockIssue);

    expect(validator.comment.calledBefore(validator.close)).toBeTruthy();
    expect(validator.comment.calledOnce).toBeTruthy();
    expect(validator.comment.calledWithExactly(mockIssue, 'practice-fork.mst'));
    expect(validator.close.calledOnce).toBeTruthy();
    expect(validator.close.calledWithExactly(mockIssue));
  });

  it('Greylist should comment and close if title is valid', () => {
    const mockIssue = { pull_request: {}, title: '[W2.2b][W09-A1]James Yong' };

    executeMockRun(Greylist, {}, mockIssue);

    expect(validator.comment.calledBefore(validator.close)).toBeTruthy();
    expect(validator.comment.calledOnce).toBeTruthy();
    expect(validator.comment.calledWith(mockIssue, 'wrong-repository.mst'));
    expect(validator.close.calledOnce).toBeTruthy();
    expect(validator.close.calledWithExactly(mockIssue));
  });

  it('Greylist should ignore if title is title not valid', () => {
    const mockIssue = { pull_request: {}, title: 'not valid' };

    executeMockRun(Greylist, {}, mockIssue);

    expect(validator.comment.notCalled).toBeTruthy();
    expect(validator.close.notCalled).toBeTruthy();
  });

  it('Whitelist should warn if title not valid', () => {
    const mockIssue = {
      pull_request: {},
      user: { login: 'abc' },
      title: 'not valid',
      labels: []
    };

    executeMockRun(Whitelist, {}, mockIssue);

    expect(validator.warn.calledOnce).toBeTruthy();
    expect(
      validator.warn.calledWith(mockIssue, 'FormatCheckRequested',
        'format-check-request.mst', { username: 'abc' }))
      .toBeTruthy();
    expect(validator.removeLabel.notCalled).toBeTruthy();
    expect(validator.addUniqueLabel.notCalled).toBeTruthy();
    expect(validator.assign.notCalled).toBeTruthy();
    expect(validator.requestReview.notCalled).toBeTruthy();
  });

  it('Whitelist should warn if phase A submitted for AB3 during W6', () => {
    const mockIssue = {
      pull_request: {},
      user: { login: 'abc' },
      title: '[W6.2b][W09-A1]James Yong',
      labels: []
    };
    const mockRepo = {
      repo: 'addressbook-level3'
    };

    executeMockRun(Whitelist, mockRepo, mockIssue);

    expect(validator.warn.calledOnce).toBeTruthy();
    expect(
      validator.warn.calledWith(mockIssue, 'FormatCheckRequested',
        'wrong-phase-LO.mst', {}))
      .toBeTruthy();
    expect(validator.removeLabel.notCalled).toBeTruthy();
    expect(validator.addUniqueLabel.notCalled).toBeTruthy();
    expect(validator.assign.notCalled).toBeTruthy();
    expect(validator.requestReview.notCalled).toBeTruthy();
  });

  it('Whitelist should warn if phase A submitted for AB3 during W6', () => {
    const mockIssue = {
      pull_request: {},
      user: { login: 'abc' },
      title: '[W6.2b][W09-A1]James Yong',
      labels: []
    };
    const mockRepo = {
      repo: 'addressbook-level3'
    };

    executeMockRun(Whitelist, mockRepo, mockIssue);

    expect(validator.warn.calledOnce).toBeTruthy();
    expect(
      validator.warn.calledWith(mockIssue, 'FormatCheckRequested',
        'wrong-phase-LO.mst', {}))
      .toBeTruthy();
    expect(validator.removeLabel.notCalled).toBeTruthy();
    expect(validator.addUniqueLabel.notCalled).toBeTruthy();
    expect(validator.assign.notCalled).toBeTruthy();
    expect(validator.requestReview.notCalled).toBeTruthy();
  });

  it('Whitelist should warn if username not found', () => {
    const mockIssue = {
      pull_request: {},
      user: { login: 'abc' },
      title: '[W6.2b][W09-A1]James Yong',
      labels: []
    };
    const mockRepo = {
      repo: 'test'
    };
    const mockPhaseMappings = { A: sinon.createStubInstance(StudentMapping) };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMappings);

    expect(validator.warn.calledOnce).toBeTruthy();
    expect(
      validator.warn.calledWith(mockIssue, 'GithubUsernameRequested', 'username-check-request.mst',
        { username: 'abc', githubUsernameIssueLink: config.githubUsernameIssueLink }))
      .toBeTruthy();
    expect(validator.removeLabel.notCalled).toBeTruthy();
    expect(validator.addUniqueLabel.notCalled).toBeTruthy();
    expect(validator.assign.notCalled).toBeTruthy();
    expect(validator.requestReview.notCalled).toBeTruthy();
  });

  it('Whitelist should should remove format check request once title is valid', () => {
    const mockIssue = {
      pull_request: {},
      user: { login: 'abc' },
      title: '[W6.2b][W09-A1]James Yong',
      labels: [{ name: 'FormatCheckRequested' }]
    };
    const mockRepo = {
      repo: 'test'
    };
    const mockPhaseMappings = { A: sinon.createStubInstance(StudentMapping) };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMappings);
    expect(validator.removeLabel.calledWith(mockIssue, 'FormatCheckRequested')).toBeTruthy();
  });

  it('Whitelist should should remove username not found request once username is found', () => {
    const mockIssue = {
      pull_request: {},
      user: { login: 'abc' },
      title: '[W6.2b][W09-A1]James Yong',
      labels: [{ name: 'GithubUsernameRequested' }]
    };
    const mockRepo = {
      repo: 'test'
    };
    const phaseAMapping = sinon.createStubInstance(StudentMapping);
    phaseAMapping.getInfoForStudent.withArgs('abc').returns({
      supervisor: '',
      reviewer: 'OuyangDanwen',
      labels: ['team.A1', 'tutorial.T11']
    });
    const mockPhaseMappings = { A: phaseAMapping };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMappings);
    expect(validator.removeLabel.calledWith(mockIssue, 'GithubUsernameRequested')).toBeTruthy();
  });

  it('Whitelist should assign correct phase A issue with labels for valid PR', () => {
    const mockIssue = {
      pull_request: {},
      user: { login: 'abc' },
      title: '[W6.2b][W09-A1]James Yong',
      labels: []
    };
    const mockRepo = {
      repo: 'test'
    };
    const phaseAMapping = sinon.createStubInstance(StudentMapping);
    phaseAMapping.getInfoForStudent.withArgs('abc').returns({
      supervisor: 'a',
      reviewer: 'b',
      labels: ['team.A1', 'tutorial.T11']
    });
    const phaseBMapping = sinon.createStubInstance(StudentMapping);
    phaseBMapping.getInfoForStudent.withArgs('abc').returns({
      supervisor: 'c',
      reviewer: 'd',
      labels: ['team.B1', 'tutorial.T12']
    });
    const mockPhaseMappings = { A: phaseAMapping, B: phaseBMapping };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMappings);

    expect(validator.warn.notCalled).toBeTruthy();
    expect(validator.removeLabel.notCalled).toBeTruthy();
    expect(validator.addUniqueLabel.calledTwice).toBeTruthy();
    expect(validator.addUniqueLabel.calledWith(mockIssue, 'team.A1')).toBeTruthy();
    expect(validator.addUniqueLabel.calledWith(mockIssue, 'tutorial.T11')).toBeTruthy();
    expect(validator.assign.calledOnce).toBeTruthy();
    expect(validator.assign.calledWith(mockIssue, 'a')).toBeTruthy();
    expect(validator.requestReview.calledOnce).toBeTruthy();
    expect(validator.requestReview.calledWith(mockIssue, 'b')).toBeTruthy();
  });

  it('Whitelist should assign correct phase B issue with labels for valid PR', () => {
    const mockIssue = {
      pull_request: {},
      user: { login: 'abc' },
      title: '[W6.2b][W09-B1]James Yong',
      labels: []
    };
    const mockRepo = {
      repo: 'test'
    };
    const phaseAMapping = sinon.createStubInstance(StudentMapping);
    phaseAMapping.getInfoForStudent.withArgs('abc').returns({
      supervisor: 'a',
      reviewer: 'b',
      labels: ['team.A1', 'tutorial.T11']
    });
    const phaseBMapping = sinon.createStubInstance(StudentMapping);
    phaseBMapping.getInfoForStudent.withArgs('abc').returns({
      supervisor: 'c',
      reviewer: 'd',
      labels: ['team.B1', 'tutorial.T12']
    });
    const mockPhaseMappings = { A: phaseAMapping, B: phaseBMapping };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMappings);

    expect(validator.warn.notCalled).toBeTruthy();
    expect(validator.removeLabel.notCalled).toBeTruthy();
    expect(validator.addUniqueLabel.calledTwice).toBeTruthy();
    expect(validator.addUniqueLabel.calledWith(mockIssue, 'team.B1')).toBeTruthy();
    expect(validator.addUniqueLabel.calledWith(mockIssue, 'tutorial.T12')).toBeTruthy();
    expect(validator.assign.calledOnce).toBeTruthy();
    expect(validator.assign.calledWith(mockIssue, 'c')).toBeTruthy();
    expect(validator.requestReview.calledOnce).toBeTruthy();
    expect(validator.requestReview.calledWith(mockIssue, 'd')).toBeTruthy();
  });
});
