const bodyParser = require("body-parser");
const express = require('express');
require('dotenv').config();

const app = express();
const loginRouter = require('./routes/login');
const manageRouter = require('./routes/managePost');
const createRouter = require('./routes/createPost');
const editRouter = require('./routes/editPost');
const cookie = require('./routes/cookie');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

app.use("/login",loginRouter);
app.use("/manage",manageRouter);
app.use("/create",createRouter);
app.use("/edit",editRouter);

app.get('/', (request, response) => {
    if(request.socket.remoteAddress in cookie) response.render("dashboard",{userInfo:cookie[request.socket.remoteAddress]});
    else response.redirect("/login");
});

app.get('/index', (request, response) => {
    response.redirect("/");
});

app.get('/dashboard', (request, response) => {
    response.redirect("/");
});

app.listen(process.env.PORT || 8080, () => console.log(`Started server at http://localhost:3000!`));