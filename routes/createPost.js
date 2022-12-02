const express = require('express');
const crypto = require('crypto');
const router = express.Router();
require('dotenv').config();

const connection = require('./database');
const cookie = require('./cookie');

const { marked } = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window)


router.get("/",(request,response) => {
    
    if (request.socket.remoteAddress in cookie){
        let hash = crypto.createHash('md5').update((new Date()).toLocaleString()+crypto.randomInt(1000)).digest('hex');
        connection.query(
        "INSERT INTO `posts`(`id`, `mail`, `title`, `description`, `report`, `category`, `visibility`, `anonymous`, `comment`, `draft`, `datetime`) VALUES ('"+hash+"','"+cookie[request.socket.remoteAddress]["mail"]+"','','','','0','0','0','0','1','"+(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString()+"')",(err, result, fields)=>{
            response.redirect("edit/"+hash);
        });
        connection.query("INSERT INTO `notifications`(`mail`, `title`, `message`, `button`, `icon`, `color`, `datetime`, `isread`) VALUES ('"+cookie[request.socket.remoteAddress]["mail"]+"','Post Creation','Created A New Post, Saved In Draft.','"+'<a class="btn btn-sm btn-secondary" href="../edit/'+hash+'">View Post</a>'+"','fa-solid fa-file-pen','primary','"+(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString()+"','0')",(err, result, fields)=>{});
        return;
    }
    response.redirect("/login");
});


module.exports = router;