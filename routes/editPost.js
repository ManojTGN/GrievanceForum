const express = require('express');
const router = express.Router();
require('dotenv').config();

const connection = require('./database');
const cookie = require('./cookie');

const { marked } = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window)

router.get("/",(request,response) => {
    response.redirect("../");
});

router.get("/:id",(request,response) => {
    if (request.socket.remoteAddress in cookie){
        connection.query(
        "SELECT * FROM `posts` WHERE `id`='"+request.params.id+"'",(err, result, fields)=>{
            if(result.length == 0 || err != null){
                response.render("edit404");
                return;
            }
            response.render("edit",{userInfo:cookie[request.socket.remoteAddress],postInfo:{'id':request.params.id,'title':result[0]['title'], 'description':result[0]['description'], 'report':result[0]['report'], 'category':result[0]['category'], 'visibility':result[0]['visibility'], 'anonymous':result[0]['anonymous'], 'comment':result[0]['comment']}});
        });
        return;
    }
    response.redirect("/login");
});

router.post("/",(request,response) => {
    if("preview" in request.body){
        let markdown = dompurify.sanitize(marked(request.body["report"]));// <%-check%>
        response.send(markdown);
        return;
    }

    if("save" in request.body){
        connection.query("UPDATE `posts` SET `title`='"+request.body['title']+"', `description`='"+request.body['description']+"', `report`='"+request.body['report']+"', `category`='"+request.body['category']+"', `visibility`='"+request.body['visibility']+"', `anonymous`='"+request.body['anonymous']+"', `comment`='"+request.body['comment']+"', `support`='"+request.body['support']+"' WHERE id='"+request.body['id']+"';",(err, result, fields)=>{
            if(err) response.sendStatus(500);
            else response.sendStatus(200);
        });
        return;
    }

    if("post" in request.body){
        connection.query("UPDATE `posts` SET `title`='"+request.body['title']+"', `description`='"+request.body['description']+"', `report`='"+request.body['report']+"', `category`='"+request.body['category']+"', `visibility`='"+request.body['visibility']+"', `anonymous`='"+request.body['anonymous']+"', `comment`='"+request.body['comment']+"', `support`='"+request.body['support']+"', `draft`='0' WHERE id='"+request.body['id']+"';",(err, result, fields)=>{
            connection.query("INSERT INTO `notifications`(`mail`, `title`, `message`, `button`, `icon`, `color`, `datetime`, `isread`) VALUES ('"+cookie[request.socket.remoteAddress]["mail"]+"','Post Submission','You Have Posted An Submission To The GrivanceForum','"+'<a class="btn btn-sm btn-secondary" href="../post/'+request.body['id']+'">View Post</a>'+"','fa-solid fa-file-circle-check','success','"+(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString()+"','0')",(err, result, fields)=>{});
            if(err) response.sendStatus(500);
            else response.sendStatus(200);
        });
        return;
    }

    if("delete" in request.body){
        connection.query("DELETE FROM `posts` WHERE `id`='"+request.body['id']+"';",(err, result, fields)=>{
            connection.query("INSERT INTO `notifications`(`mail`, `title`, `message`, `icon`, `color`, `datetime`, `isread`) VALUES ('"+cookie[request.socket.remoteAddress]["mail"]+"','Post Deletion','The Post Has Been Deleted (unrecovered)','fa-regular fa-trash-can','danger','"+(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString()+"','0')",(err, result, fields)=>{});
            if(err) response.sendStatus(500);
            else response.sendStatus(200);
        });
        return;
    }

    response.sendStatus(200);
});
 
module.exports = router;