require('dotenv').config();
//import dotenv from 'dotenv';
const mysql = require('mysql2/promise');
//import 'mysql2/promise';

module.exports = mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
        //queueLimit: 0,
        //connectionLimit: 0
});