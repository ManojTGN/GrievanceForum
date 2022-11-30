const bodyParser = require("body-parser");
const express = require('express');
require('dotenv').config();

const app = express();
const loginRouter = require('./routes/login');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

app.use("/login",loginRouter['router']);

app.get('/', (request, response) => { 
    //console.log(loginRouter['LoggedInUsers']);
    
    if(request.socket.remoteAddress in loginRouter['LoggedInUsers']) response.render("dashboard");
    else response.redirect("/login");
});

app.listen(process.env.PORT || 8080, () => console.log(`Started server at http://localhost:3000!`));