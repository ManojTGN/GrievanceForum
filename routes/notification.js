const express = require('express');
const router = express.Router();
require('dotenv').config();

const connection = require('./database');
const cookie = require('./cookie');

router.get("/",(request,response) => {

    if ( !(request.cookies['login'] in cookie) ){
        response.redirect("/login");
        return;
    }
    
    connection.query("SELECT * FROM `notifications` WHERE `mail`='"+cookie[request.cookies['login']]['mail']+"' ORDER BY `sno` DESC",(err,result,fields) => {
    connection.query("SELECT * FROM `notifications` WHERE `isread`='0' AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err, urnotifications, fields) => {
        response.render("notification",{userInfo:cookie[request.cookies['login']],notifications:result,xnotifications:urnotifications.length});
    });
    });
    return;
    
});

router.post("/",(request,response) => {

    if ( !(request.cookies['login'] in cookie) ){
        response.redirect("/login");
        return;
    }

    connection.query("UPDATE `notifications` SET `isread`='1' WHERE `mail`='"+cookie[request.cookies['login']]['mail']+"' AND `isread`='0'",(err,result,fields) => {});
    response.sendStatus(200);
});

module.exports = router;