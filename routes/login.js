const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const router = express.Router()
require('dotenv').config();

const connection = require('../routes/database');
let LoggedInUsers = {}

router.get("/",(request,response) => {
    response.render("login",{client_id:process.env.CLIENT_ID})
});

router.post("/",(request,response) => {
    let user = jsonwebtoken.decode(request.body["credential"]);
    //console.log(user);
    
    connection.query("SELECT * FROM `users` WHERE `mail`='"+user['email']+"'",(err, result, fields) => { 
        if (err) throw err;
        if(result.length < 1)
            connection.query("INSERT INTO `users`(`username`, `mail`) VALUES ('"+user['name']+"','"+user['email']+"')", (err, result, fields) => { if (err) throw err; });
        
        LoggedInUsers[request.socket.remoteAddress]=user['email'];
    });
    
    response.redirect("../");
});

module.exports = {'router':router,'LoggedInUsers':LoggedInUsers};
//module.exports = router;