const StudentMapping = require('../src/StudentMapping');
const path = require('path');

it('should extract data correctly', () => {
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
  const mapping = new StudentMapping(path.join(__dirname, '../data.sample.csv'));
  expect(mapping.data).toEqual(data);
  expect(mapping.getInfoForStudent('l')).toBeFalsy();
  expect(mapping.getInfoForStudent('pokka')).toEqual(pokka);
  expect(mapping.getInfoForStudent('PHUa')).toEqual(phua);
});