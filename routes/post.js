const express = require('express');
const router = express.Router();
require('dotenv').config();

const { marked } = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window)

const connection = require('./database');
const cookie = require('./cookie');

router.get("/:id",(request,response) => {
    if (request.socket.remoteAddress in cookie){
        connection.query(
        "SELECT * FROM `posts` WHERE `id`='"+request.params.id+"' AND `anonymous`='0'",(err, result, fields)=>{
            if(result.length == 0 || err != null){
                response.render("edit404");
                return;
            }

            let post = result;
            connection.query("SELECT * FROM `postinfo` WHERE `postid`='"+request.params.id+"' AND `mail`='"+cookie[request.socket.remoteAddress]['mail']+"' AND type='0'",(err, result, fields) => {
                if(result.length == 0){
                    connection.query("INSERT INTO `postinfo`( `postid`, `mail`, `type`) VALUES ('"+request.params.id+"','"+cookie[request.socket.remoteAddress]['mail']+"','0')",(err, result, fields) => {});
                    connection.query("UPDATE `posts` SET `views`= views+1 WHERE `id`='"+request.params.id+"'",(err, result, fields) => {});
                }
            });
            connection.query("SELECT * FROM `postinfo` WHERE `postid`='"+request.params.id+"' AND `mail`='"+cookie[request.socket.remoteAddress]['mail']+"' AND type='1'",(err, result, fields) => {
                let markdown = dompurify.sanitize(marked(post[0].report));// <%-check%>
                response.render("post",{userInfo:cookie[request.socket.remoteAddress],postInfo:post[0],report:markdown,isSupporting:result.length});
            });
        });
        return;
    }
    response.redirect("/login");
});

router.post("/",(request,response) => {
    if("supportPost" in request.body){
        connection.query("SELECT * FROM `postinfo` WHERE `postid`='"+request.body.id+"' AND `mail`='"+cookie[request.socket.remoteAddress]['mail']+"' AND type='1'",(err, result, fields) => {
            if(result.length == 0){
                connection.query("INSERT INTO `postinfo`( `postid`, `mail`, `type`) VALUES ('"+request.body.id+"','"+cookie[request.socket.remoteAddress]['mail']+"','1')",(err, result, fields) => {response.send('1');});
                connection.query("UPDATE `posts` SET `likes`= likes+1 WHERE `id`='"+request.body.id+"'",(err, result, fields) => {});
            }else{
                connection.query("DELETE FROM `postinfo` WHERE `postid`='"+request.body.id+"' AND `mail`='"+cookie[request.socket.remoteAddress]['mail']+"' AND `type`='1'",(err, result, fields) => {response.send('0');});
                connection.query("UPDATE `posts` SET `likes`= likes-1 WHERE `id`='"+request.body.id+"'",(err, result, fields) => {});
            }
        });
    }
});

module.exports = router;