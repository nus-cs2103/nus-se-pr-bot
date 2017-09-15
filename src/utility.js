const Promise = require('bluebird');

const castStreamToString = (stream) => {
  let promise = new Promise((resolve, reject) => {
    let s = '';
    stream.on('data', data => { s += data.toString(); });
    stream.on('end', () => resolve(s));
    stream.on('error', reject);
  });
  return promise;
};

module.exports = {
  _titleRegex: /^\s*\[W\d{1,2}\.\d{1,2}\D?\]\s*\[([WTF]\d{2})-[AB](\d)\]/i,
  _rcsTitleRegex: /^Add(ing|ed){0,1}\s.+\.txt/i,
  castStreamToString: castStreamToString
};
