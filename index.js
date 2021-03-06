const express=require('express');
const env= require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app=express();
const port=8000;

// View Helper
require('./config/view-helpers')(app);
// import imagemin from 'gulp-imagemin';

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// Used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
// passport google strategy
const passportGoogle = require('./config/passport-google-oauth2-strategy'); 

// to store in db
const MongoStore = require('connect-mongo');

// sass middleware
const sassMiddleware  = require('node-sass-middleware');
//Flash 
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Aquire path
const path = require('path');


// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port: 5000');


if (env.name == 'development'){
    
// Using sassMiddleware
app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, 'scss'), // src for sass file
    dest: path.join(__dirname, env.asset_path, 'css'), // dest to store scss file after compiling
    debug: true, // show errors in console
    outputStyle: 'expanded',
    prefix: '/css'
}));

}




app.use(express.urlencoded());
app.use(cookieParser());

// app.use(express.static('./assets'));
app.use(express.static(env.asset_path));

// make the upload path visible to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// Using logger
app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up view engine
app.set('view engine','ejs');
app.set('views','./views');


// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    // store: MongoStore.create({ mongoUrl: 'mongodb://localhost/codeial_development' })
    store: MongoStore.create(
        {  
            mongoUrl: 'mongodb://localhost/codeial_development',
            autoRemove: 'disabled'
        },
        function(error){console.log(error || "Connect-mongodb setup ok");

    })
    
}));





// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
//Flash
app.use(flash());
app.use(customMware.setFlash);


// Using express router
app.use('/',require('./routes/index'));



app.listen(port,function(err){
    if(err){
        console.log(`Error running server: ${err}`);
        return;
    }
    console.log("Server is up and running on port:",port);
})