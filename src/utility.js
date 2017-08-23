const castStreamToString = (stream, cb = () => {}) => {
  let s = '';
  stream.on('data', data => s += data.toString());
  stream.on('end', () => cb(s));
};

module.exports = {
  _titleRegex: /^\[(\w+)\]\[([W|T|F]{1}\d{2})(-[A|B|C]{1}(\d{1})){0,1}\]/i,
  _rcsTitleRegex: /^Add[ing|ed]{0,1}\s.+\.txt/i
  castStreamToString: castStreamToString
};
