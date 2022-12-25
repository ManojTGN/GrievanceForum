var mysql=require('mysql');

var connection=mysql.createConnection({
   host:'containers-us-west-123.railway.app',
   user:'root',
   password:'nVk9GR1v6vihSdqPT3jp',
   database:'railway'
});

connection.connect(function(error){
    if(error) throw error;
});

module.exports = connection; 