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
    
    if ( !(request.cookies['login'] in cookie) ){
        response.redirect("/login");
        return;
    }

    if (request.cookies['login'] in cookie){
        let short_id = "";
        let hash = crypto.createHash('md5').update((new Date()).toLocaleString(undefined,{timeZone: 'Asia/Kolkata'})+request.cookies['login']['mail']+crypto.randomInt(1000)).digest('hex');
        
        if(cookie[request.cookies['login']]['anonymous'] == 1){
            short_id = hash.slice(0,5);
        }

        connection.query(
        "INSERT INTO `posts`(`id`, `mail`, `title`, `description`, `report`, `category`, `cat_name`, `visibility`, `anonymous`, `comment`, `draft`, `datetime`, `name`, `picture`, `short_id`) VALUES ('"+hash+"','"+cookie[request.cookies['login']]["mail"]+"','','','','0','','0','0','0','1','"+(new Date()).toLocaleString(undefined,{timeZone: 'Asia/Kolkata'})+"','"+cookie[request.cookies['login']]["name"]+"','"+cookie[request.cookies['login']]["picture"]+"','"+short_id+"')",(err, result, fields)=>{
            response.redirect("../edit/"+hash);
        });
        connection.query("INSERT INTO `notifications`(`mail`, `title`, `message`, `button`, `icon`, `color`, `datetime`, `isread`) VALUES ('"+cookie[request.cookies['login']]["mail"]+"','Post Creation','Created A New Post, Saved In Draft.','"+'<a class="btn btn-sm btn-secondary" href="../edit/'+hash+'">Edit Post</a>'+"','fa-solid fa-file-pen','primary','"+(new Date()).toLocaleString(undefined,{timeZone: 'Asia/Kolkata'})+"','0')",(err, result, fields)=>{});
        return;
    }
    response.redirect("/login");
});


module.exports = router;