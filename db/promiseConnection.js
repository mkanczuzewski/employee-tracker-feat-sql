const mysql = require('mysql2/promise');

// Connect to database
const dbPromise = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'test10$',
      database: 'emp_track'
    },
    console.log('Connected to the emp_track database.')
  );

  module.exports = dbPromise;