const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const loginRouter = require('./routes/login');
const manageRouter = require('./routes/managePost');
const createRouter = require('./routes/createPost');
const editRouter = require('./routes/editPost');
const notifyRouter = require('./routes/notification');
const profileRouter = require('./routes/profile');
const cookie = require('./routes/cookie');
const connection = require("./routes/database");
const postRouter = require("./routes/post");

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine","ejs");

app.use("/login",loginRouter);
app.use("/manage",manageRouter);
app.use("/create",createRouter);
app.use("/edit",editRouter);
app.use("/notification",notifyRouter);
app.use("/profile",profileRouter);
app.use("/post",postRouter);

app.get('/', (request, response) => {
    if(!(request.cookies['login'] in cookie)){
        console.log(`ip: ${request.socket.remoteAddress} Connected To The Server!`)
        response.redirect("/login");
        return;
    }

    if(cookie[request.cookies['login']]['isadmin'] == 1){
        connection.query("SELECT * FROM `category`",(err, result, fields) => {
            response.render("admin",{userInfo:cookie[request.cookies['login']],category:result});
        });
        return;
    }

    connection.query("SELECT * FROM `category`",(err, result, fields) => {
        response.render("dashboard",{userInfo:cookie[request.cookies['login']],category:result});
    });
});

app.post('/', (request, response) => {
    if("loadPost" in request.body){
        if(request.body.onload == 0){
            connection.query("SELECT * FROM `posts` WHERE `draft`='0' ORDER BY `sno` DESC",(err, result, fields) => {
                response.send(result);
            });
            return;
        }

        if(request.body.onload == 2){
            connection.query("SELECT * FROM `posts` WHERE `draft`='0' AND `category`='"+request.body.category+"' ORDER BY `sno` DESC",(err, result, fields) => {
                response.send(result);
            });
            return;
        }

        if(request.body.filter == 0){
            connection.query("SELECT * FROM `posts` WHERE `draft`='0' AND (`title` LIKE '%"+request.body.search+"%' OR `description` LIKE '%"+request.body.search+"%')",(err, result, fields) => {
                response.send(result);
            });
            return
        }

        if(request.body.filter == 1){
            
            let query = `
            SELECT * FROM posts WHERE draft=0`
            + ((request.body.isadminview == 1)?` AND (visibility=0 OR visibility=1)`:` AND visibility=0`)
            + ((request.body.search == '')?``:` AND (title LIKE '%${request.body.search}%' OR description LIKE '%${request.body.search}%')`)
            + ((request.body.category == 0)?``:` AND category='${request.body.category}'`)
            + ((request.body.canComment == 0)?``:` AND comment='${request.body.canComment}'`)
            + ((request.body.canSupport == 0)?``:` AND support='${request.body.canSupport}'`)
            + ((request.body.status == 2)?` AND (status=0 OR status=1)`:((request.body.status == 1)?` AND status=1`:` AND status=0`))
            + ((request.body.sort == 0)?` ORDER BY views DESC`:` ORDER BY sno DESC`)
            ;

            console.log(query);

            connection.query(query,(err, result, fields) => {
                if(request.body.date != 4){
                    let date;
                    for(let i = result.length-1;i>=0;i--){
                        date = result[i].datetime.split(' ')[0].split('/');
                        date = ( (new Date()) - (new Date(+date[2], +date[1] - 1 , +date[0])) ) / 86400000;//1000 * 3600 * 24
                        if( request.body.date == 0){if(date > 1) result.splice(i, 1);}
                        else if( request.body.date == 1){if(date > 7) result.splice(i, 1);}
                        else if( request.body.date == 2){if(date > 30) result.splice(i, 1);} 
                        else if( request.body.date == 3){if(date > 365) result.splice(i, 1);}
                    }
                }
                response.send(result);
            });
            return
        }
    }
});

app.get('/logout', (request, response) => { delete cookie[request.cookies['login']];delete request.cookies['login'];response.redirect("/login"); });
app.get('/index', (request, response) => { response.redirect("../"); });
app.get('/dashboard', (request, response) => { response.redirect("../"); });
app.listen(port,() => console.log(`GrievanceForum Server Started Successfully!\n`));