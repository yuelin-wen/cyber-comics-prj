const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const HTTP_PORT = process.env.PORT || 3000;
const adminData = require('./modules/admin.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static('public'));


app.use(adminData.routes);
app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`);
});
