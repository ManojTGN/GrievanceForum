const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const connection = require('../routes/database');
const cookie = require('../routes/cookie');

router.get("/",(request,response) => {
    response.render("login",{client_id:process.env.CLIENT_ID})
});

router.post("/",(request,response) => {
    let user = jsonwebtoken.decode(request.body["credential"]);
    connection.query("SELECT * FROM `users` WHERE `mail`='"+user['email']+"'",(err, result, fields) => { 
        if (err) throw err;
        
        let isadmin = 0;
        if(result.length < 1)
            connection.query("INSERT INTO `users`(`username`, `mail`) VALUES ('"+user['name']+"','"+user['email']+"')", (err, result, fields) => { if (err) throw err; });
        else
            isadmin = result[0].isadmin;
        
        cookie[request.socket.remoteAddress]={'mail':user['email'],'name':user['name'],'picture':user['picture'],'isadmin':isadmin};
        response.redirect("../");
    });
});
 
module.exports = router;