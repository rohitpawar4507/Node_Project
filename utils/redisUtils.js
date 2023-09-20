// // utils/redisUtils.js
// const redisClient = require('../config/redisConn'); // Import the Redis client

// // Function to set a key-value pair in Redis with an expiration time
// function set(key, value, expirationInSeconds = 3600) {
//   return new Promise((resolve, reject) => {
//     redisClient.set(key, value, 'EX', expirationInSeconds, (err, reply) => {
//       if (err) {
//         console.error('Redis Error:', err);
//         reject(err);
//         return;
//       }
//       resolve(reply);
//     });
//   });
// }

// // Function to get a value from Redis using a key
// function get(key) {
//   return new Promise((resolve, reject) => {
//     redisClient.get(key, (err, reply) => {
//       if (err) {
//         console.error('Redis Error:', err);
//         reject(err);
//         return;
//       }
//       resolve(reply);
//     });
//   });
// }

// module.exports = {
//   set,
//   get,
// };



// utils/redisUtils.js
const redisClient = require('../config/redisConn'); // Import the Redis client

// Function to set a key-value pair in Redis with an expiration time
function set(key, value, expirationInSeconds = 3600) {
  return new Promise((resolve, reject) => {
    redisClient.client.set(key, value, 'EX', expirationInSeconds, (err, reply) => {
      if (err) {
        console.error('Redis Error:', err);
        reject(err);
        return;
      }
      resolve(reply);
    });
  });
}

// Function to get a value from Redis using a key
function get(key) {
  return new Promise((resolve, reject) => {
    redisClient.client.get(key, (err, reply) => {
      if (err) {
        console.error('Redis Error:', err);
        reject(err);
        return;
      }
      resolve(reply);
    });
  });
}

module.exports = {
  set,
  get,
};
