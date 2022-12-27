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

    connection.query("SELECT * FROM `posts` WHERE `mail`='"+cookie[request.cookies['login']]['mail']+"' AND `draft`=1",(err,result,fields) => {
    connection.query("SELECT * FROM `notifications` WHERE `isread`='0' AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err, urnotifications, fields) => {
        response.render("manage",{userInfo:cookie[request.cookies['login']],drafts:result,xnotifications:urnotifications.length});
    });
    });
});

module.exports = router;