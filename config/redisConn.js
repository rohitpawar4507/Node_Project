// // config/redis.js
// require('dotenv').config()
// const redis = require('redis');


// client = redis.createClient({
//    url: `redis://${process.env.redis_host}:${process.env.redis_port}` });


// client.on('connect', () => {
//     console.log('Connected to Redis');
//    });



// client.on("error", (error) => console.error(`Error : ${error}`));



// // client.on('error', (err) => {
// //   console.error('Redis Error:', err);
// // });

// require('dotenv').config();
// const redis = require('redis');

// let client;

// (async () => {
//   client = redis.createClient({
//     url: `redis://${process.env.redis_host}:${process.env.redis_port}`,
//   });

//   client.on('error', (error) => console.error(`Error: ${error}`));

//   // No need to manually connect, Redis client will connect automatically

//   client.on('connect', () => {
//     console.log('Connected to Redis');
//   });
// })();

// // Listen for the 'error' event to handle any connection errors
// client.on('error', (err) => {
//   console.error('Redis connection error:', err);
// });

// // Listen for the 'end' event to handle when the connection is closed
// client.on('end', () => {
//   console.log('Redis connection closed');
// });

// module.exports = {
//   client,
// };


require('dotenv').config();
const redis = require('redis');


const client = redis.createClient({
  host:'127.0.0.1',
  port: '6379',
  
});

client.on('error', (error) => {
  console.error(`Error: ${error}`);
});

// No need to manually connect, Redis client will connect automatically

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Listen for the 'error' event to handle any connection errors
client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Listen for the 'end' event to handle when the connection is closed
client.on('end', () => {
  console.log('Redis connection closed');
});

module.exports = {
  client,
};


