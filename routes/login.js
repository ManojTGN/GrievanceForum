const express = require('express');
const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const connection = require('../routes/database');
const cookie = require('../routes/cookie');

router.get("/",(request,response) => {
    response.render("login",{client_id:process.env.CLIENT_ID})
});

router.post("/",(request,response) => {

    let hash = crypto.createHash('md5').update((new Date()).toLocaleString(undefined,{timeZone: 'Asia/Kolkata'})+crypto.randomInt(1000)+"x"+crypto.randomInt(1000)).digest('hex');

    if("guest" in request.body){
        response.cookie('login',hash);
        cookie[hash]={'mail':'@bitsathy.ac.in','name':'Anonymous','picture':'images/guestProfiles/'+Math.floor(Math.random() * 9)+'.jpg','isadmin':0,'anonymous':1};
        response.redirect("../");
        return;
    }

    let user = jsonwebtoken.decode(request.body["credential"]);
    connection.query("SELECT * FROM `users` WHERE `mail`='"+user['email']+"'",(err, result, fields) => { 
        if (err) throw err;
        
        let isadmin = 0;
        let admintype = 0;
        if(result.length < 1){
            connection.query("INSERT INTO `users`(`username`, `mail`, `isadmin`) VALUES ('"+user['name']+"','"+user['email']+"',0)", (err, result, fields) => { if (err) throw err; });
        }else{
            isadmin = result[0].isadmin;
            admintype = result[0].admintype;
        }
        response.cookie('login',hash);
        cookie[hash]={'mail':user['email'], 'name':user['name'], 'picture':user['picture'], 'isadmin':isadmin, 'admintype':admintype, 'anonymous':0};
        response.redirect("../");
    });
});
 
module.exports = router;