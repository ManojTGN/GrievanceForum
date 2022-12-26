const express = require('express');
const router = express.Router();
require('dotenv').config();

const connection = require('./database');
const cookie = require('./cookie');

router.get("/",(request,response) => {
    if(request.cookies['login'] in cookie){
        connection.query("SELECT * FROM `users` WHERE `mail`='"+cookie[request.cookies['login']]['mail'],(err,result,fields) => {
            connection.query("SELECT * FROM `posts` WHERE `draft`=0 AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err,res,fields) => {
                response.render("profile",{userInfo:cookie[request.cookies['login']],MainUserInfo:result,posts:res,bookmarks:[]});
            });
            
        });
        return;
    }
    response.redirect("../");
});

router.post("/",(request,response) => {
    
    response.sendStatus(200);
});

module.exports = router;