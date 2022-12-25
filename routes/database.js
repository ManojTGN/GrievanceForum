var mysql=require('mysql');
require('dotenv').config();

var connection=mysql.createConnection({
   host:process.env.DB_HOST,
   user:'root',
   /*port:6790,*/
   password:process.env.DB_PASS,
   database:'railway'
});

connection.connect(function(error){
    if(error) throw error;
});

module.exports = connection; 