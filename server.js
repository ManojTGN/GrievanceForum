const express = require('express');
const app = express();

const loginRouter = require('./routes/login');

app.set("view engine","ejs");
app.use("/login",loginRouter);

app.get('/', (request, response) => {
    response.render("dashboard");
});

app.listen(3000);