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

const user_details = (req, res) => {
    let sql = 'SELECT * FROM users WHERE id = ?';
    connection.query(sql, req.params.id, (err, result) => {
        res.render('user', {data: result});
    });
}
const user_logout = (req, res) => {
    res.clearCookie('sid');
    res.redirect('http://localhost:3000/');
}
const user_auth_status = (req, res, next) => {
    if(req.cookies.sid) {
        connection.query('SELECT user FROM sessions WHERE id = ?', req.cookies.sid, (err, result) => {
            if(err) {console.log(err);}
            if(req.params.id == result[0].user) {
                next();
            }
            else {
                res.redirect(`http://localhost:3000/user/${result[0].user}`);
            }
        });
    }
    else {
        res.redirect('http://localhost:3000/login');
    }
}
module.exports = {
    user_details,
    user_logout,
    user_auth_status
}