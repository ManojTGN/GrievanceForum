const express = require('express');
const router = express.Router();
require('dotenv').config();

const connection = require('./database');
const cookie = require('./cookie');

router.get("/",(request,response) => {
    if(request.socket.remoteAddress in cookie){
        connection.query("SELECT * FROM `posts` WHERE `mail`='"+cookie[request.socket.remoteAddress]['mail']+"' AND `draft`=1",(err,result,fields) => {
            response.render("manage",{userInfo:cookie[request.socket.remoteAddress],drafts:result});
        });
        return;
    }
    response.redirect("../");
});

module.exports = router;