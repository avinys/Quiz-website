const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCSRFTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const notFoundMiddleware = require('./middlewares/not-found');
const cartMiddleware = require('./middlewares/cart');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = createSessionConfig();

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);

app.use(addCSRFTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', protectRoutesMiddleware, ordersRoutes);
app.use('/admin', protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatatbase()
.then(function () {
    app.listen(3000);
})
    .catch(function (error) {
        console.log('Failed to connect to the database!');
        console.log(error);
    });