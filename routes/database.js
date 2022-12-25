var mysql=require('mysql2');
require('dotenv').config();

var connection = mysql.createPool({
    user:'root',
    port:6790,
    host:process.env.DB_HOST,
    password:process.env.DB_PASS,
    database:'railway'
})

module.exports = connection; 