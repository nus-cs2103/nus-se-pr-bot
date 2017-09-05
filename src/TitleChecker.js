class TitleChecker {
  constructor(pattern) {
    this.formatCheckLabel = 'FormatCheckRequested';
    this.pattern = pattern || '';
  }

  // Checks if label matches with the FormatCheckLabel
  // Case insensitive.
  hasCheckRequestLabel(labels) {
    return labels.map(label => {
      return label.name.toLowerCase() === this.formatCheckLabel.toLowerCase();
    })
      .reduce((a, b) => a || b, false);
  }

  check(title) {
    return this.pattern.exec(title);
  }
}

module.exports = TitleChecker;
