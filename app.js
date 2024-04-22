const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');
const addCSRFTokenMiddleware = require('./middlewares/csrf-token');

const createSessionConfig = require('./config/session');
const db = require('./database');

const app = express();

const authRoutes = require('./routes/auth-routes');
const baseRoutes = require('./routes/base.routes');
const mainRoutes = require('./routes/main-routes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = createSessionConfig();

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(addCSRFTokenMiddleware);

app.use(baseRoutes);
// auth middleware
app.use(authRoutes);
app.use(mainRoutes);

db.connectToDatatbase()
.then(function () {
    app.listen(3000);
})
    .catch(function (error) {
        console.log('Failed to connect to the database!');
        console.log(error);
    });