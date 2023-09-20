
//1.authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { set, get } = require('../utils/redisUtils');
const logger = require('../utils/logger'); // Import the logger
const { log } = require('winston');


//function to retrieve the token from Redis based on user ID
function getToken(userId) {
  return get(userId.toString());
}

// Register a new user
async function register(req, res) {
  // Log the incoming request
  logger.logger.info(`Incoming Request - URL: ${req.url}, Method: ${req.method},Query: ${JSON.stringify(req.query)}, Body: ${JSON.stringify(req.body)}`);

  const { username, password, firstName, lastName, email } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the database
  db.query(
    'INSERT INTO users (username, password, firstName, lastName, email) VALUES (?, ?, ?, ?, ?)',
    [username, hashedPassword, firstName, lastName, email],
    (err, result) => {
      if (err) {
        // Log the SQL query and error
       // logger.logger.error(`SQL Query - ${req.query}`);
        //logger.logger.error(`Error: ${err}`);

        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      // Log the SQL query and response
      //logger.logger.info(`SQL Query - ${db.sql}`);
      //logger.logger.info(`SQL Response - ${JSON.stringify(result)}`);
      logger.logger.info('User registered successfully')

      res.status(201).json({ message: 'User registered successfully' });
    }
  );
}

// Login and generate a JWT token
async function login(req, res) {
  // Log the incoming request
  logger.logger.info(`Incoming Request - URL: ${req.url}, Method: ${req.method},Query: ${JSON.stringify(req.query)}, Body: ${JSON.stringify(req.body)}`);

  const { username, password } = req.body;

  // Check if the user exists
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, result) => {
      if (err) {
        // Log the SQL query and error
        logger.logger.error(`SQL Query - ${db.sql}`);
        logger.logger.error(`Error: ${err}`);

        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      if (result.length === 0) {
        res.status(401).json({ message: 'Authentication failed' });
        return;
      }

      const user = result[0];

      // Compare the provided password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(401).json({ message: 'Authentication failed. Password not match' });
        return;
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, 'rohitPawar', {
        expiresIn: '1h',
      });

      // Set req.user with user information
      req.user = { userId: user.id }; // Set req.user here
      console.log(req.user.userId)
      // Store the JWT token in Redis using the set function
      await set(user.id.toString(), token, 3600);

      logger.logger.info(`User Logged in Successfully  Generated JWT token: ${token}  User ID: ${req.user.userId}` );
      // logger.logger.info(`Generated JWT token: ${token}`);
      // logger.logger.info(`User ID: ${req.user.userId}`);
      res.status(200).json({ message: 'Login Successful', token });
    }
  );
}

// Protected route to get all data

async function getAllData(req, res) {

  // Log the incoming request
  logger.logger.info(`Incoming Request - URL: ${req.url}, Method: ${req.method}, Query: ${JSON.stringify(req.query)}, Body: ${JSON.stringify(req.body)}`);
  // Retrieve the token for the current user
  const userId = req.user.userId;
  try {
    const token = await getToken(userId);
    // Here you have the token, and you can use it as needed
    console.log('Token from Redis:', token);
    console.log('UserId: ', userId);
  // Now, you can proceed to fetch the data or perform other actions

    // For example, if you want to fetch data from the database:
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      //logger.logger.info('Data Fetch successfully')
      logger.logger.info(`Data Fetch successfully Result: ${JSON.stringify(result)}`);
      //console.log('Data fetched successfully:', result);
      res.status(200).json({ data: result });
    });
  } catch (err) {
    console.error('Redis Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// Get a user by ID
function getUserById(req, res) {
  const userId = req.params.id;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = result[0];
    logger.logger.info('User fetch by Id');
    res.status(200).json({ user });
  });
}

// Update a user by ID
function updateUserById(req, res) {
  const userId = req.params.id;
  const { username, firstName, lastName, email } = req.body;

  db.query(
    'UPDATE users SET username = ?, firstName = ?, lastName = ?, email = ? WHERE id = ?',
    [username, firstName, lastName, email, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      if (result.affectedRows === 0) {
        logger.logger.info('User not found')
        res.status(404).json({ message: 'User not found' });
        return;
      }

      logger.logger.info('User updated successfully.')
      res.status(200).json({ message: 'User updated successfully' });
    }
  );
}

// Delete a user by ID
function deleteUserById(req, res) {
  const userId = req.params.id;

  db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (result.affectedRows === 0) {
      logger.logger.info('User not found')
      res.status(404).json({ message: 'User not found' });
      return;
    }

    logger.logger.info('User deleted successfully.')
    res.status(200).json({ message: 'User deleted successfully' });
  });
}

module.exports = {
  register,
  login,
  getAllData,
  getUserById,
  updateUserById,
  deleteUserById,
};
