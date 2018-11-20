/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './data/chaindata';
const db = level(chainDB);


function isGenesis(key) {
  return parseInt(key) === 0
}

// Add data to levelDB with key/value pair
function addLevelDBData(key, value) {
  return new Promise((resolve, reject) => {
    db.put(key, JSON.stringify(value), function (err) {
      if (err) reject(err);
    })
  });
}

exports.addLevelDBData = function (key, value) {
  return new Promise((resolve, reject) => {
    db.put(key, JSON.stringify(value), function (err) {
      if (err) reject(err);
    })
  });
}


// Get data from levelDB with key
exports.getBlock = function (blockHeight) {
  return new Promise((resolve, reject) => {
    db.get(blockHeight, function (err, value) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(value)));
      }
    });
  })
}


// Get block height
exports.getBlockHeight = function () {
  return new Promise((resolve, reject) => {
    let i = 0;
    db.createReadStream().on('data', function (data) {
      i++;
    }).on('error', function (err) {
      reject(err);
    }).on('close', function () {
      resolve(i - 1);
    });
  }).catch((err) => {
    reject(err);
  });
}

// Add data to levelDB with value
exports.addDataToBlockchain = function (Block) {
  return new Promise((resolve, reject) => {
    let i = 0;
    db.createReadStream().on('data', function (data) {
      i++;
    }).on('error', function (err) {
      reject(err);
    }).on('close', function () {
      console.log('Block #' + i);
      addLevelDBData(i, Block);
    });
  });
}

exports.getBlockByHash = function (hash) {
  let block

  return new Promise((resolve, reject) => {
      db.createReadStream().on('data', (data) => {
          block = JSON.parse(data.value)

          if (block.hash === hash) {
              if (!isGenesis(data.key)) {
                  block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString()
                  return resolve(block)
              } else {
                  return resolve(block)
              }
          }
      }).on('error', (error) => {
          return reject(error)
      }).on('close', () => {
          return reject('Not found')
      })
  })
}

exports.getBlocksByAddress = function (address) {
  const blocks = []
  let block

  return new Promise((resolve, reject) => {
      db.createReadStream().on('data', (data) => {
          // Don't check the genesis block
          if (!isGenesis(data.key)) {
              block = JSON.parse(data.value)

              if (block.body.address === address) {
                  block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString()
                  blocks.push(block)
              }
          }
      }).on('error', (error) => {
          return reject(error)
      }).on('close', () => {
          return resolve(blocks)
      })
  })
}





/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/


// (function theLoop(i) {
//   setTimeout(function () {
//     addDataToLevelDB('Testing data');
//     if (--i) theLoop(i);
//   }, 100);
// })(10);
