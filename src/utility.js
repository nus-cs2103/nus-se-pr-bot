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
  _titleRegex: /^\s*(\[[a-zA-Z\s,()-/]+]\sDuke\sIncrements)|(\[CS2103T?-([WTF])[0-9]{2}-[0-9]].*)|(\[AY1920S1-CS2113T?-([WTF])[0-9]{2}-[0-9]].*)/i,
  _rcsTitleRegex: /^Add(ing|ed){0,1}\s.+\.txt/i,
  castStreamToString: castStreamToString
};
