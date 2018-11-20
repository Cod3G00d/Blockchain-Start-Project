/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './data/userSignaturedata';
const db = level(chainDB);


// Add data to levelDB with key/value pair

exports.addSignature = function (key, value) {
  return new Promise((resolve, reject) => {
    db.put(key, JSON.stringify(value), function (err) {
      if (err) reject(err);
    })
  });
}

// Get data from levelDB with key
exports.getSignature = function (address) {
  return new Promise((resolve, reject) => {
    db.get(address, function (err, value) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(value)));
      }
    });
  })
}

// Delete data from levelDB with key
exports.delSignature = function (address) {
  return new Promise((resolve, reject) => {
    db.del(address, function (err, value) {
      if (err) {
        reject(err);
      }
    });
  })
};
