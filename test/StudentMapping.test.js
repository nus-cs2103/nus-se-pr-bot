const StudentMapping = require('../src/StudentMapping');
const path = require('path');
const mapping = new StudentMapping(path.join(__dirname, '../data.sample.csv'));
const louislai = {
  supervisor: 'madsonic',
  reviewer: 'mauris',
  labels: ['team.nonExistent', 'tutorial.nonExistent']
};
const phua = {
  supervisor: '',
  reviewer: 'OuyangDanwen',
  labels: ['team.A2', 'tutorial.T11']
};
const pokka = {
  supervisor: '',
  reviewer: 'OuyangDanwen',
  labels: ['team.A1', 'tutorial.T11']
};
const mario = {
  supervisor: 'Aquaman',
  reviewer: 'Superman',
  labels: ['team.A2', 'tutorial.T11']
};

it('should extract data correctly from multiple lines', () => {
  const data = { louislai, phua, pokka, mario };
  expect(mapping.data).toEqual(data);
});

it('should extract data correctly when all fields are given', () => {
  expect(mapping.getInfoForStudent('louislai')).toEqual(louislai);
});

it('should extract data correctly when some fields are missing', () => {
  expect(mapping.getInfoForStudent('pokka')).toEqual(pokka);
});

it('should indicate missing data', () => {
  expect(mapping.getInfoForStudent('l')).toBeFalsy();
});
