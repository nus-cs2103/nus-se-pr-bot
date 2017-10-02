const util = require('./utility');
const mu = require('mu2');

class Validator {
  constructor(accuser, account, repoName) {
    this.accuser = accuser;
    this.account = account;
    this.repoName = repoName;
    this.repo = accuser.addRepository(account, repoName);
    this.worker = this.repo.newWorker();
  }

  set doBlock(block) {
    this.worker.do(block);
  }

  set filterBlock(block) {
    this.worker.filter(block);
  }

  // check if title conforms to pattern given
  // title: string to check
  // pattern: regex pattern to use for checking
  // return: array of results containing groups of the regex match
  // null is returned if there are no matches
  static checkTitle(title, pattern) {
    return pattern.exec(title);
  }

  // check if label is contain in list of labels from issue
  // issue: labels from this issue
  // label: label to search for
  static hasLabel(issue, labelName) {
    return issue.labels.map(issueLabel => issueLabel.name.toLowerCase())
      .includes(labelName.toLowerCase());
  }

  // apply a warning label and comment to issue
  warn(issue, labelToApply, warningTemplate, mapping, logText) {
    // label applied implies issue processed
    if (Validator.hasLabel(issue, labelToApply)) {
      return;
    }

    console.log(`${logText}`);

    this.addUniqueLabels(issue, labelToApply);
    this.comment(issue, warningTemplate, mapping);
  }

  // adds labels to issue
  // TODO: find out how duplicate labels are caused in github history
  addUniqueLabels(issue, labels) {
    labels.forEach(label => {
      if (!Validator.hasLabel(issue, label)) {
        this.accuser.addLabels(this.repo, issue, [label]);
      }
    });
  }

  removeLabel(issue, label) {
    console.log(`${this.account}/PR # ${issue.number}: Removing ${label}`);
    this.accuser.removeLabel(this.repo, issue, label);
  }

  // assigns a user to the issue
  assign(issue, user) {
    if (!user) {
      console.log(`${this.account}/PR #${issue.number}: No reviewer found`);
      return;
    }

    console.log(`${this.account}/PR #${issue.number}: Assigning ${user}`);
    this.accuser.accuse(this.repo, issue, user);
  }

  comment(issue, commentTemplate, mapping) {
    console.log(`${this.account}/PR #${issue.number}: Commenting`);
    const strMapping = mapping || {};
    const commentStream = mu.compileAndRender(commentTemplate, strMapping);
    util.castStreamToString(commentStream)
      .then(comment => this.accuser.comment(this.repo, issue, comment));
  }

  close(issue) {
    console.log(`${this.account}/PR #${issue.number}: Closing`);
    this.accuser.close(this.repo, issue);
  }
}

module.exports = Validator;
