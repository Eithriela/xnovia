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

const login_page = (req, res) => {
    res.render('login');
}
const login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql, username, (err, result) => {
        if(result.length==0) {
            console.log('invalid username');
            res.redirect('#');
        }
        else {
            if(result[0].password==password) {
                // let values = [result[0].id, result[0].username];
                connection.query(`INSERT INTO sessions (user, username) VALUES (${result[0].id}, '${result[0].username}')`, (err, result2) => {
                    if(err) {console.log(err);}
                    else{
                        console.log('Session created! ID: ', result2.insertId);
                        let sid = result2.insertId;
                        
                        res.cookie('sid', sid, {maxAge: 60000});
                        res.redirect('http://localhost:3000/');
                    }
                });
            }
            else {
                console.log('invalid password');
                res.redirect('#');
            }
        }
        
    });
}
module.exports = {
    login_page,
    login
}