const mysql = require('mysql');
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

const entries_get_all = (req, res) => {
    let sql = 'SELECT * FROM entries';
    connection.query(sql, (err, result, fields) => {
        if (err) {console.log('Failed to get record', err);}
        else{
            res.render('entries', {data: result});
        }
    });
}
const entries_search = (req, res) => {
    text = req.query.search;
    text += '%';
    let sql = 'SELECT * FROM entries WHERE title LIKE ?';
    connection.query(sql, text, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            let text2 = '%' + text;
            let sql2 = 'SELECT * FROM entries WHERE title LIKE ? AND title NOT LIKE "'+text+'"';
            connection.query(sql2, text2, (err, result2) => {
                if (err) {
                    console.log(err);
                }
                else {
                    result = result.concat(result2);
                    res.send(JSON.stringify(result));
                }
            });
        }
    });
}
const entry_editor = (req, res) => {
    if (req.params.id) {
        sql='SELECT * FROM entries WHERE id = ?';
        connection.query(sql, req.params.id, (err, result) => {
            res.render('entry_editor', {data: result});
        });
    }
    else{
        let data = [];
        res.render('entry_editor', {data});
    }
    
}
const entry_update = (req, res) => {
    let title = req.body.title;
    let text = req.body.text;
    let user = 1;
    
    let sql = `UPDATE entries SET title = '${title}', text = '${text}', user_created = ${user} WHERE id = ${req.params.id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('Failed to update record', err);
        }
        else {
            console.log(result);
            
        }  
    });
}
const entry_create = (req, res) => {
    let title = req.body.title;
    let text = req.body.text;
    let user = 1;
    let values = [title, text, user];
    let sql = 'INSERT INTO entries (title, text, user_created) VALUES (?)';
    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.log('Failed to upload record', err);
        }
        else {
            console.log(result);
            
        }  
    });
}
const entries_details = (req, res) => {
    let sql = 'SELECT * FROM entries WHERE id = ?';
    connection.query(sql, req.params.id, (err, result) => {
        res.render('entry_details', {data: result});
    });
}
module.exports = {
    entries_search,
    entries_get_all,
    entry_create,
    entry_editor,
    entries_details,
    entry_update
}