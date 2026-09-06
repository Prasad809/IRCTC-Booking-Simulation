const mysql = require('mysql2/promise');
require('dotenv').config();

const createPool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    port:process.env.dbport,
    password: process.env.password,
    database: process.env.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = createPool;
