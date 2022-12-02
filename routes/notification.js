const express = require('express');
const router = express.Router();
require('dotenv').config();

const connection = require('./database');
const cookie = require('./cookie');

router.get("/",(request,response) => {
    if(request.socket.remoteAddress in cookie){
        connection.query("SELECT * FROM `notifications` WHERE `mail`='"+cookie[request.socket.remoteAddress]['mail']+"' ORDER BY `sno` DESC",(err,result,fields) => {
            response.render("notification",{userInfo:cookie[request.socket.remoteAddress],notifications:result});
        });
        return;
    }
    response.redirect("../");
});

router.post("/",(request,response) => {
    connection.query("UPDATE `notifications` SET `isread`='1' WHERE `mail`='"+cookie[request.socket.remoteAddress]['mail']+"' AND `isread`='0'",(err,result,fields) => {});
    response.sendStatus(200);
});

module.exports = router;