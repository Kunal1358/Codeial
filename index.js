const express=require('express');
const port=8000;

const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');

const app=express();

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



// Using express router
app.use('/',require('./routes/index'));



// set up view engine
app.set('view engine','ejs');
app.set('views','./views')


app.listen(port,function(err){
    if(err){
        console.log(`Error running server: ${err}`);
        return;
    }
    console.log("Server is up and running on port:",port);
})