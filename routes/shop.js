const express = require('express');
//const path = require('path');

//const rootDir = require('../util/path');

// const adminData = require('./admin');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// router.get('/', (req, res, next) => {
//     //res.sendFile(path.join(__dirname, '..', 'views', 'shop.html')); //use only when rootDir not imported (only using path import)
//     // console.log(adminData.product);
//     // res.sendFile(path.join(rootDir, 'views', 'shop.html')); //sendFile would send a file. In this case would send file base on path.join line code
//     res.render('shop.ejs', {
//         prod: adminData.product, 
//         pageTitle: 'Shop', 
//         path: '/', 
//         hasProduct: adminData.product.length > 0, 
//         shopCSS: true, 
//         shopActive: true
//     }); //this would render pug, handlebars, or ejs extention file because in the app.js file there's view engine pug, handlebars, and ejs extention in it. The object are the data to be send into the file
// });

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart); //isAuth is a middleware function that placed in middleware folder. This code simply check if user is authenticated to access the routes
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete', isAuth, shopController.postCartDelete);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrders);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/invoice/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
//exports.routes = router; //another way to export router (in the imported file the code should be written like app.use('/', shopData.routes); the shopData is const shopData = require('./routes/shop');)