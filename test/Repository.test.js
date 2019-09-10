const Validator = require('../src/Validator');
const Blacklist = require('../src/Blacklist');
const Greylist = require('../src/Greylist');
const Whitelist = require('../src/Whitelist');
const StudentMapping = require('../src/StudentMapping');
const sinon = require('sinon');

describe('Repository methods', () => {
  let validator;

  beforeEach(() => {
    validator = sinon.createStubInstance(Validator);
  });

  afterEach(() => {
    sinon.restore();
  });

  const executeMockRun = (klass, repo, issue, phaseMappings, moduleName, moduleConfig) => {
    Object.defineProperty(validator, 'doBlock', {
      set: block => block(repo, issue)
    });
    Object.defineProperty(validator, 'filterBlock', {
      set: filter => expect(filter(repo, issue)).toBeTruthy()
    });

    const listItem = new klass({}, '', '', validator, phaseMappings, moduleName, moduleConfig);
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
    const mockIssue = { pull_request: {}, title: '[James Yong] Duke Increments' };

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
      head: {
        ref: 'master'
      },
      pull_request: {},
      user: { login: 'abc' },
      title: 'not valid',
      labels: []
    };
    // TODO: @yunpengn avoid the hack below, what if there is module named cs2103?
    const mockModuleName = 'cs2103';
    const mockModuleConfig = {
      originatingBranches: ['master']
    };
    const mockPhaseMapping = sinon.createStubInstance(StudentMapping);
    mockPhaseMapping.getInfoForStudent.withArgs('abc').returns({
      supervisor: '',
      reviewer: '',
      labels: []
    });
    executeMockRun(Whitelist, {}, mockIssue, mockPhaseMapping, mockModuleName, mockModuleConfig);

    expect(validator.warn.calledOnce).toBeTruthy();
    expect(
      validator.warn.calledWith(mockIssue, 'FormatCheckRequested',
        `${mockModuleName}/format-check-request.mst`, { username: 'abc' }))
      .toBeTruthy();
    expect(validator.removeLabel.notCalled).toBeTruthy();
    expect(validator.addUniqueLabel.notCalled).toBeTruthy();
    expect(validator.assign.notCalled).toBeTruthy();
    expect(validator.requestReview.notCalled).toBeTruthy();
  });

  it('Whitelist should warn if username not found', () => {
    const mockIssue = {
      head: {
        ref: 'master'
      },
      pull_request: {},
      user: { login: 'abc' },
      title: '[James Yong] Duke Increments',
      labels: []
    };
    const mockRepo = {
      repo: 'test'
    };
    const mockPhaseMapping = sinon.createStubInstance(StudentMapping);
    const mockModuleConfig = {
      githubUsernameIssueLink: 'random text',
      originatingBranches: ['master']
    };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMapping, '', mockModuleConfig);

    expect(validator.warn.calledOnce).toBeTruthy();
    expect(
      validator.warn.calledWith(mockIssue, 'GithubUsernameRequested', 'username-check-request.mst',
        { username: 'abc', githubUsernameIssueLink: mockModuleConfig.githubUsernameIssueLink }))
      .toBeTruthy();
    expect(validator.removeLabel.notCalled).toBeTruthy();
    expect(validator.addUniqueLabel.notCalled).toBeTruthy();
    expect(validator.assign.notCalled).toBeTruthy();
    expect(validator.requestReview.notCalled).toBeTruthy();
  });

  it('Whitelist should should remove format check request once title is valid', () => {
    const mockIssue = {
      head: {
        ref: 'master'
      },
      pull_request: {},
      user: { login: 'abc' },
      title: '[James Yong] Duke Increments',
      labels: [{ name: 'FormatCheckRequested' }]
    };
    const mockRepo = {
      repo: 'test'
    };
    const mockPhaseMapping = sinon.createStubInstance(StudentMapping);
    const mockModuleConfig = {
      githubUsernameIssueLink: 'random text',
      originatingBranches: ['master']
    };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMapping, '', mockModuleConfig);
    expect(validator.removeLabel.calledWith(mockIssue, 'FormatCheckRequested')).toBeTruthy();
  });

  it('Whitelist should should remove username not found request once username is found', () => {
    const mockIssue = {
      head: {
        ref: 'master'
      },
      pull_request: {},
      user: { login: 'abc' },
      title: '[James Yong] Duke Increments',
      labels: [{ name: 'GithubUsernameRequested' }]
    };
    const mockRepo = {
      repo: 'test'
    };
    const mockPhaseMapping = sinon.createStubInstance(StudentMapping);
    mockPhaseMapping.getInfoForStudent.withArgs('abc').returns({
      supervisor: '',
      reviewer: 'OuyangDanwen',
      labels: ['team.A1', 'tutorial.T11']
    });
    const mockModuleConfig = {
      githubUsernameIssueLink: 'random text',
      originatingBranches: ['master']
    };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMapping, '', mockModuleConfig);
    expect(validator.removeLabel.calledWith(mockIssue, 'GithubUsernameRequested')).toBeTruthy();
  });

  it('Whitelist should assign correct issue with labels for valid PR', () => {
    const mockIssue = {
      head: {
        ref: 'master'
      },
      pull_request: {},
      user: { login: 'abc' },
      title: '[James Yong] Duke Increments',
      labels: []
    };
    const mockRepo = {
      repo: 'test'
    };
    const mockPhaseMapping = sinon.createStubInstance(StudentMapping);
    mockPhaseMapping.getInfoForStudent.withArgs('abc').returns({
      supervisor: 'a',
      reviewer: 'b',
      labels: ['team.A1', 'tutorial.T11']
    });
    const mockModuleConfig = {
      githubUsernameIssueLink: 'random text',
      originatingBranches: ['master']
    };

    executeMockRun(Whitelist, mockRepo, mockIssue, mockPhaseMapping, '', mockModuleConfig);

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

  it('should comment and close if not from correct originating branch', () => {
    const mockIssue = {
      head: {
        ref: 'branch-other'
      },
      pull_request: {},
      user: { login: 'abc' },
      title: '[James Yong] Duke Increments',
      labels: []
    };
    const mockModuleConfig = {
      originatingBranches: ['master']
    };

    executeMockRun(Whitelist, {}, mockIssue, {}, '', mockModuleConfig);

    expect(validator.comment.calledOnce).toBeTruthy();
    expect(validator.close.calledOnce).toBeTruthy();
  });
});
