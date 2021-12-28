const mysql = require('mysql2/promise');

// Connect to database
const db = mysql.createPool(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'test10$',
      database: 'emp_track',
      waitForConnections:true,
      connectionLimit: 5,
      queueLimit: 0,
    },
    console.log('Connected to the emp_track database.')
  );

  module.exports = db;