const Parser = require('../src/DataParser');

it('should extract data correctly', () => {
  let expected = {
    'louislai': {
      'tutor': 'madsonic',
      'reviewer': 'mauris',
      'labels': ['team.nonExistent', 'tutorial.nonExistent']
    }
  };
  expect(Parser.parse(path.join(process.env.PWD, '/data.sample.csv'))).toEqual(expected);
});