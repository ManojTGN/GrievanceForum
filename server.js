const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const loginRouter = require('./routes/login');
const manageRouter = require('./routes/managePost');
const createRouter = require('./routes/createPost');
const editRouter = require('./routes/editPost');
const notifyRouter = require('./routes/notification');
const profileRouter = require('./routes/profile');
const cookie = require('./routes/cookie');
const connection = require("./routes/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine","ejs");

app.use("/login",loginRouter);
app.use("/manage",manageRouter);
app.use("/create",createRouter);
app.use("/edit",editRouter);
app.use("/notification",notifyRouter);
app.use("/profile",profileRouter);

//Only For Testing
cookie[process.env.PH_LOGIN_IP]={'mail':'manoj.ig20@bitsathy.ac.in','name':'MANOJ A','picture':'https://lh3.googleusercontent.com/a/ALm5wu2I6ZF4fmjt38CgaQxL1YNL7jmvk-cHCwxzOy94=s96-c'};
cookie[process.env.PC_LOGIN_IP]={'mail':'manoj.thunderviz@gmail.com','name':'MANOJ A','picture':'https://lh3.googleusercontent.com/a/ALm5wu3nd1GdJO4M-ucv16RoGUPE8X-9bde8ebm_gakm8g=s96-c'};
cookie["10.10.87.243"]={'mail':'ajayekm@gmail.com','name':'AJAYE KM','picture':'https://lh3.googleusercontent.com/a/ALm5wu2I6ZF4fmjt38CgaQxL1YNL7jmvk-cHCwxzOy94=s96-c'}

app.get('/', (request, response) => {
    console.log(request.socket.remoteAddress);
    if(request.socket.remoteAddress in cookie) response.render("dashboard",{userInfo:cookie[request.socket.remoteAddress]});
    else response.redirect("/login");
});

app.post('/', (request, response) => {
    if("loadPost" in request.body){
        connection.query("SELECT * FROM `posts` WHERE `draft`='0' AND `anonymous`='0'",(err, result, fields) => {
            response.send(result);
        });
    }
});

app.get('/index', (request, response) => { response.redirect("/"); });
app.get('/dashboard', (request, response) => { response.redirect("/"); });
app.listen(process.env.PORT || 8080, "localhost" || "10.10.85.121" || process.env.HOST ,() => console.log(`GrievanceForum Server Started Successfully!`));