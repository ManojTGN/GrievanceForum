const express = require('express');
const router = express.Router();
require('dotenv').config();

const connection = require('./database');
const cookie = require('./cookie');

router.get("/:id",(request,response) => {
    response.render("post",{userInfo:cookie[request.socket.remoteAddress]});
});

router.post("/",(request,response) => {
    response.sendStatus(200);
});

module.exports = router;