const StudentMapping = require('../src/StudentMapping');
const path = require('path');

it('should extract data correctly', () => {
  let louislai = {
    'tutor': 'madsonic',
    'reviewer': 'mauris',
    'labels': ['team.nonExistent', 'tutorial.nonExistent']
  };
  let phua = {
    'tutor': '',
    'reviewer': 'OuyangDanwen',
    'labels': ['team.A2', 'tutorial.T11']
  };
  let pokka = {
    'tutor': '',
    'reviewer': 'OuyangDanwen',
    'labels': ['team.A1', 'tutorial.T11']
  }
  let data = { louislai, phua, pokka };
  let mapping = new StudentMapping(path.join(__dirname, '../data.sample.csv'));
  expect(mapping.data).toEqual(data);
  expect(mapping.getInfoForStudent('l')).toBeFalsy();
  expect(mapping.getInfoForStudent('pokka')).toEqual(pokka);
  expect(mapping.getInfoForStudent('PHUa')).toEqual(phua);
});