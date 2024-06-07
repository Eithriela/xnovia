const express = require('express');
const entriesRouter=require('./routs/entriesRouter');
const loginRouter = require('./routs/loginRouter');
const userRouter = require('./routs/userRouter');
const cookieParser = require('cookie-parser');


const mysql = require('mysql2');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'mihaela',
    password: 'H530n730',
    database: 'xnoviadb'
});
connection.connect((err) => {
    if (err) {
        console.log('Failed to connect. Err: ', err);
    }
    else {
        console.log('Connected to DB. ID: ', connection.threadId);
    }
});

const app= express();
app.set('view engine', 'ejs');
app.set('query parser', 'extended');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// session handler
app.use((req, res, next) => {
    if(req.cookies.sid) {
        connection.query('SELECT * FROM sessions WHERE id = ?', req.cookies.sid, (err, result) => {
            if(err) {console.log(err);}
            app.locals.userID=`${result[0].user}`;
            app.locals.username = `${result[0].username}`;
            next();
        });
    }
    else {
        app.locals.userID='';
        app.locals.username = '';
        next();
    }
    console.log(req.url, req.method);
    
});

// routes
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.use('/entries', entriesRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);

//404 page
app.use((req, res) => {
    res.status(404).send('<p>404 Page not found</p>');
});
app.listen(3000);
