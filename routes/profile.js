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

    connection.query("SELECT * FROM `users` WHERE `mail`='"+cookie[request.cookies['login']]['mail'],(err,result,fields) => {
        connection.query("SELECT * FROM `posts` WHERE `draft`=0 AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err,res,fields) => {
            connection.query("SELECT * FROM `postinfo` WHERE `type`=3 AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err,bookmark,fields) => {
            connection.query("SELECT * FROM `notifications` WHERE `isread`='0' AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err, urnotifications, fields) => {    
                
                connection.query("SELECT * FROM `postinfo` WHERE `type`=0 AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err,totalViews,fields) => {
                connection.query("SELECT * FROM `postinfo` WHERE `type`=1 AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err,totalLikes,fields) => {
                connection.query("SELECT * FROM `comments` WHERE `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err,totalComments,field)=>{
                    response.render("profile",{userInfo:cookie[request.cookies['login']],MainUserInfo:result,posts:res,bookmarks:bookmark,xnotifications:urnotifications.length,totalViews:totalViews,totalLikes:totalLikes,totalComments:totalComments});
                });
                });
                });
            
            });
            });
        });
    });
    
});

router.post("/",(request,response) => {

    if ( !(request.cookies['login'] in cookie) ){
        response.redirect("/login");
        return;
    }
    
    if('deleteBookmark' in request.body){
        connection.query("DELETE FROM `postinfo` WHERE `type`=3 AND `postid`='"+request.body.id+"' AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err,bookmark,fields) => {});
        response.sendStatus(200);
        return;
    }
});

module.exports = router;