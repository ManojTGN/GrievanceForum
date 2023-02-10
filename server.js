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

app.post('/q',(request,response)=>{
    if(request.body.name == "sendQuestion"){

    connection.query("SELECT * FROM `placement` WHERE `id`="+request.body.number,(err, result, fields) => {
    if(result.length < 1) connection.query("INSERT INTO `placement`(`id`, `questions`, `answers`) VALUES ("+request.body.number+",'"+request.body.question+"','Nothing Found') ",(err, result, fields) => {});
    else connection.query("UPDATE `placement` SET `questions`='"+request.body.question+"' WHERE `id`="+request.body.number,(err, result, fields) => {});
    });

    response.sendStatus(200);
    return;
    }

    response.sendStatus(500);
});

app.get('/q/:id',(request,response)=>{
    connection.query("SELECT * FROM `placement` WHERE `id`='"+request.params.id+"'",(err, result, fields) => {
    if(result.length < 1) response.json({ answer: "Unable To Find Question ("+request.params.id+")" });
    else response.json({ answer:result[0].answers });
    });

});

app.get('/settings', (request, response) => {
    if(!(request.cookies['login'] in cookie)){
        response.redirect("/login");
        return;
    }

    if(cookie[request.cookies['login']]['isadmin'] == 1){
        connection.query("SELECT * FROM `settings`",(err, result, fields) => {
            response.render("settings",{userInfo:cookie[request.cookies['login']],settings:result});
        });
        return;
    }
});

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
    connection.query("SELECT * FROM `notifications` WHERE `isread`='0' AND `mail`='"+cookie[request.cookies['login']]['mail']+"'",(err, urnotifications, fields) => {
        response.render("dashboard",{userInfo:cookie[request.cookies['login']],category:result,xnotifications:urnotifications.length});
    });
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

            connection.query(query,(err, result, fields) => {
                if(request.body.date != 4){
                    let date;let db_date;
                    for(let i = result.length-1;i>=0;i--){
                        date = result[i].datetime.replace(",","").split(' ')[0].split('/');
                        db_date = (new Date()).toLocaleString(undefined,{timeZone: 'Asia/Kolkata'}).replace(",","").split(' ')[0].split('/');

                        date = ( (new Date(+db_date[2], +db_date[0] - 1 , +db_date[1])) - (new Date(+date[2], +date[0] - 1 , +date[1])) ) / 86400000;//1000 * 3600 * 24
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