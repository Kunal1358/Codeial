const express=require('express');
const cookieParser = require('cookie-parser');
const app=express();
const port=8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// Used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');




app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));


// app.use(expressLayouts);
// // extract style and scripts from sub pages into the layout
// app.set('layout extractStyles', true);
// app.set('layout extractScripts', true);


// set up view engine
app.set('view engine','ejs');
app.set('views','./views');


app.use(session({
    // TODO change the secret before deployment in production mode
    name: ' Codeial',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,

    cookie: { // age of cookie in milli seconds
        maxAge: (1000 * 60 * 100)
    }

}));

// initialize passpoet
app.use(passport.initialize());
app.use(passport.session());


// Using express router
app.use('/',require('./routes/index'));



app.listen(port,function(err){
    if(err){
        console.log(`Error running server: ${err}`);
        return;
    }
    console.log("Server is up and running on port:",port);
})