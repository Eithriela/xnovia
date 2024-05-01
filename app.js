const http = require('http');
const emitter = require('events');
const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const qs = require('qs');


var events = new emitter.EventEmitter();
const app= express();
app.set('view engine', 'ejs');
app.set('query parser', 'extended');
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    let text = '';
            let id = -1;
            req.addListener('data', (chunk) => {
                
                console.log(chunk);
                id = Number(chunk[0]) - 48;
                chunk[0] = null;
                text += String(chunk);
                console.log('text received: ', text);
                console.log('id received: ', id);
                uploadPlanet(text, id);
                res.status(200).send('Uploaded');
            });
            
});

app.get('/stars', (req, res) => {
    getStars((err, data) => {
        res.render('stars', {data});
    })
    
});
app.get('/planets', (req, res) => {
    getStars((err, data) => {
        res.render('planets', {data});
    })
});
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/search', (req, res) => {
    Search(req.query.search, (err, result) => {

        res.status(200).send(JSON.stringify(result));
    });
    
});
app.get('/planet', (req, res)=> {
    getPlanet(req.query.id, (err, data) => {
        res.render('planet', {data});
    });
});
app.get('/star', (req, res)=> {
    getStar(req.query.id, (err, data) => {
        getPlanets(data[0].name, (err2, result2) => {
            res.render('star', {data, planets: result2});
        });
    });
});
app.listen(3000);

app.use((req, res) => {
    res.status(404).send('<p>404 Page not found</p>');
});
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'mihaela',
    password: 'H530n730',
    database: 'db'
});
connection.connect((err) => {
    if (err) {
        console.log('Failed to connect. Err: ', err);
    }
    else {
        console.log('Connected to DB. ID: ', connection.threadId);
    }
});


function uploadPlanet(name, parentStar) {
    let values = [name, parentStar];
    console.log('Connected to DB. ID: ', connection.threadId);
    let sql = 'INSERT INTO planets (name, parent_star) VALUES (?)';
    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.log('Failed to upload record', err);
        }
        else {
            console.log(result);
        }  
    });
}
function getStars(callback) {
    let sql = 'SELECT * FROM stars';
    connection.query(sql, (err, result, fields) => {
        if (err) {console.log('Failed to get record', err);}
        else{
            callback(err, result);
        }
    });
    
}
function getPlanet(id, callback) {
    let sql = 'SELECT * FROM planets WHERE id = ?';
    connection.query(sql, id, (err, result) => {
        if (err) {
            console.log('Failed to get record', err);
        }
        else {
            callback(err, result);
        }
    });
}
function getStar(id, callback) {
    let sql = 'SELECT * FROM stars WHERE id = ?';
    connection.query(sql, id, (err, result) => {
        if (err) {
            console.log('Failed to get record', err);
        }
        else {
            callback(err, result);
        }
    });
}
function getPlanets(starName, callback) {
    let values = [starName];
    let starId = -1;
    
    let sql2 = 'SELECT id FROM stars WHERE name = ?';
    connection.query(sql2, [values], (err, result, fields) => {
        if (err) {
            console.log('Failed to get record', err);
        }
        else {
            starId = result[0].id;
            
            let sql1 = 'SELECT * FROM planets WHERE parent_star = ?';
            connection.query(sql1, [starId], (err2, result2, fields2) => {
                if (err2) {
                    console.log('Failed to get record', err2);
                }
                else {
                    // console.log(result2);
                    callback(err2, result2);
                }
            }); 
        }
    });
}
function Search(text, callback) {
    text += '%';
    let sql = 'SELECT * FROM planets WHERE name LIKE ?';
    connection.query(sql, text, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            let text2 = '%' + text;
            let sql2 = 'SELECT * FROM planets WHERE name LIKE ? AND name NOT LIKE "'+text+'"';
            connection.query(sql2, text2, (err, result2) => {
                if (err) {
                    console.log(err);
                }
                else {
                    result = result.concat(result2);
                    callback(err, result);
                }
            });
        }
    });
}