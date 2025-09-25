const crypto = require('crypto');

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

function hmacSHA512(secret, data) {
  return crypto
    .createHmac('sha512', secret)
    .update(data, 'utf-8')
    .digest('hex');
}

module.exports = { sortObject, hmacSHA512 };
