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
        "SELECT * FROM `posts` WHERE `id`='"+request.params.id+"'",(err, result, fields)=>{
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
                connection.query("SELECT * FROM `comments` WHERE postid='"+request.params.id+"'",(err,res,field)=>{
                    connection.query("SELECT * FROM `postinfo` WHERE `postid`='"+request.params.id+"' AND `mail`='"+cookie[request.socket.remoteAddress]['mail']+"' AND type='2'",(err, r, fields) => {
                        response.render("post",{userInfo:cookie[request.socket.remoteAddress],postInfo:post[0],comments:res,report:markdown,isSupporting:result.length,solution:r});
                    });
                });
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
        return;
    }

    if("postComment" in request.body){
        connection.query(`INSERT INTO comments(mail, name, picture, postid, message, datetime) VALUES ('${cookie[request.socket.remoteAddress]['mail']}','${cookie[request.socket.remoteAddress]['name']}','${cookie[request.socket.remoteAddress]['picture']}','${request.body.id}','${request.body.message}','${(new Date()).toLocaleDateString()+' '+(new Date()).toLocaleTimeString()}')`,(err,result,field)=>{response.send('1');})
        connection.query("UPDATE `posts` SET `comments`= comments+1 WHERE `id`='"+request.body.id+"'",(err, result, fields) => {});
        return;
    }

    if("editComment" in request.body){
        connection.query("UPDATE `comments` SET `message`='"+request.body.message+"' WHERE `sno`='"+request.body.id+"'",(err,result,field)=>{response.send('1');})
        return;
    }

    if("deleteComment" in request.body){
        connection.query("DELETE FROM comments WHERE `sno`='"+request.body.id+"'",(err,result,field)=>{response.send('1');})
        connection.query("UPDATE `posts` SET `comments`= comments-1 WHERE `id`='"+request.body.Postid+"'",(err, result, fields) => {});
        return;
    }

    if("postSolution" in request.body){
        connection.query("INSERT INTO `postinfo`( `postid`,`mail`,`name`,`picture`,`message`,`type`) VALUES ('"+request.body.id+"','"+cookie[request.socket.remoteAddress]['mail']+"','"+cookie[request.socket.remoteAddress]['name']+"','"+cookie[request.socket.remoteAddress]['picture']+"','"+request.body.message+"','2')",(err, result, fields) => {response.send('1');});
        connection.query("UPDATE `posts` SET `status`= 1 WHERE `id`='"+request.body.id+"'",(err, result, fields) => {});
        return;
    }

    if("deletePost" in request.body){
        connection.query("DELETE FROM `postinfo` WHERE `id`='"+request.body.id+"'",(err, result, fields) => {response.send('1');});
        connection.query("DELETE FROM `posts` WHERE `id`='"+request.body.id+"'",(err, result, fields) => {});
        return;
    }
});

module.exports = router;