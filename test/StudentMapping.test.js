const StudentMapping = require('../src/StudentMapping');
const path = require('path');
const mapping = new StudentMapping(path.join(__dirname, '../data.sample.csv'));

it('should extract data correctly from multiple lines', () => {
  const louislai = {
    'tutor': 'madsonic',
    'reviewer': 'mauris',
    'labels': ['team.nonExistent', 'tutorial.nonExistent']
  };
  const phua = {
    'tutor': '',
    'reviewer': 'OuyangDanwen',
    'labels': ['team.A2', 'tutorial.T11']
  };
  const pokka = {
    'tutor': '',
    'reviewer': 'OuyangDanwen',
    'labels': ['team.A1', 'tutorial.T11']
  }
  const data = { louislai, phua, pokka };
  expect(mapping.data).toEqual(data);
});

it('should extract data correctly when all fields are given', () => {
  const louislai = {
    'tutor': 'madsonic',
    'reviewer': 'mauris',
    'labels': ['team.nonExistent', 'tutorial.nonExistent']
  };

  expect(mapping.getInfoForStudent('louislai')).toEqual(louislai);
});

it('should extract data correctly when some fields are missing', () => {
  const pokka = {
    'tutor': '',
    'reviewer': 'OuyangDanwen',
    'labels': ['team.A1', 'tutorial.T11']
  }
  expect(mapping.getInfoForStudent('pokka')).toEqual(pokka);
});

it('should indicate missing data', () => {
  expect(mapping.getInfoForStudent('l')).toBeFalsy();
});
