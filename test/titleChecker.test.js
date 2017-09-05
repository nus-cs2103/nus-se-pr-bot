const Checker = require('../src/TitleChecker');

describe('PR Title Checker ', () => {
  it('should have a format check label', () => {
    const checker = new Checker();
    const label = 'FormatCheckRequested';
    expect(checker.formatCheckLabel).toBe('FormatCheckRequested');
  });

  it('should have a regex pattern for matching title', () => {
    const pattern = /some pattern/i;
    const checker = new Checker(pattern);
    expect(checker.pattern).toBeInstanceOf(RegExp);
  });

  it('should have empty string by default', () => {
    const checker = new Checker();
    expect(checker.pattern).toBe('');
  });

  it('should check for invalid format request labels', () => {
    const checker = new Checker();
    const labels = [
      { name: 'randomlabel' },
      { name: 'Format Check Requested' },
      { name: 'check requested' },
      { name: 'checkrequested' }
    ];
    expect(checker.hasCheckRequestLabel(labels)).toBeFalsy();
  });

  it('should check for valid format request labels', () => {
    const checker = new Checker();
    const labels = [
      { name: 'FormatCheckRequested' },
      { name: 'formatcheckrequested' }
    ];
    expect(checker.hasCheckRequestLabel(labels)).toBeTruthy();
  });
});
