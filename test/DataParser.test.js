const Parser = require('../src/DataParser');
const path = require('path');

it('should extract data correctly', () => {
  let expected = {
    'louislai': {
      'tutor': 'madsonic',
      'reviewer': 'mauris',
      'labels': ['team.nonExistent', 'tutorial.nonExistent']
    }
  };
  expect(Parser.parse(path.join(__dirname, '../data.sample.csv'))).toEqual(expected);
});