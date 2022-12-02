const express = require('express');
const router = express.Router();
require('dotenv').config();

const connection = require('./database');
const cookie = require('./cookie');

router.get("/",(request,response) => {
    if(request.socket.remoteAddress in cookie){
        connection.query("SELECT * FROM `users` WHERE `mail`='"+cookie[request.socket.remoteAddress]['mail'],(err,result,fields) => {
            response.render("profile",{userInfo:cookie[request.socket.remoteAddress],MainUserInfo:result});
        });
        return;
    }
    response.redirect("../");
});

router.post("/",(request,response) => {
    
    response.sendStatus(200);
});

module.exports = router;