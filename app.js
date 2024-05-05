const express = require('express');
const entriesRouter=require('./routs/entriesRouter');
const app= express();
app.set('view engine', 'ejs');
app.set('query parser', 'extended');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/entries', entriesRouter);

app.use((req, res) => {
    res.status(404).send('<p>404 Page not found</p>');
});
app.listen(3000);
