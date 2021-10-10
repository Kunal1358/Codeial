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
// to store in db
const MongoStore = require('connect-mongo');

// sass middleware
const sassMiddleware  = require('node-sass-middleware');

// Using sassMiddleware
app.use(sassMiddleware({
    src: './assets/scss', // src for sass file
    dest: './assets/css', // dest to store scss file after compiling
    debug: true, // show errors in console
    outputStyle: 'expanded',
    prefix: '/css'
}));


app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));


app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up view engine
app.set('view engine','ejs');
app.set('views','./views');



// // Mongo store is used to store connection in db
// app.use(session({
//     // TODO change the secret before deployment in production mode
//     name: ' Codeial',
//     secret: 'blahsomething',
//     saveUninitialized: false,
//     resave: false,

//     cookie: { // age of cookie in milli seconds
//         maxAge: (1000 * 60 * 100)
//     },
//     store: new MongoStore(
//     {
//         mongooseConnection: db,
//         autoRemove: 'disabled'
//     },
//     function(error){
//         console.log(error || "Connect-mongodb setup ok")
//     })

// }));


// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
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





// initialize passpoet
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


// Using express router
app.use('/',require('./routes/index'));



app.listen(port,function(err){
    if(err){
        console.log(`Error running server: ${err}`);
        return;
    }
    console.log("Server is up and running on port:",port);
})