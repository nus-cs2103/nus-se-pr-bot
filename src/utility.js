const Promise = require('bluebird');

const castStreamToString = (stream) => {
  let promise = new Promise((resolve, reject) => {
    let s = '';
    stream.on('data', data => s += data.toString());
    stream.on('end', () => resolve(s));
    stream.on('error', reject);
  });
  return promise;
};

module.exports = {
  _titleRegex: /^\[(\w+)\]\[([W|T|F]{1}\d{2})(-[A|B|C]{1}(\d{1})){0,1}\]/i,
  _rcsTitleRegex: /^Add[ing|ed]{0,1}\s.+\.txt/i,
  castStreamToString: castStreamToString
};
