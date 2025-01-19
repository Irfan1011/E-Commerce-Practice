const express = require('express');
//const path = require('path');

const { check } = require('express-validator'); //3rd party packages that in the end is also middleware used for validation

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

//const rootDir = require('../util/path');

const router = express.Router();

// router.get('/add-product', (req, res, next) => {
//     //res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html')); //Used if rootDir not import (only import path)
//     //res.sendFile(path.join(rootDir, 'views', 'add-product.html')); //sendFile would send a file. In this case would send file base on path.join line code
//     res.render('add-product.ejs', {
//         pageTitle: 'Add Product', 
//         path: '/add-product', 
//         prodCSS: true,
//         prodActive: true
//     }); //this would render pug, handlebars, or ejs extention file because in the app.js file there's view engine pug, handlebars, and ejs extention in it
// }); //This code is without controller

// router.post('/add-product', (req, res, next) => {
//     // console.log(req.body);
//     product.push({title: req.body.title});
//     res.redirect('/');
// }); //This code is without controller

router.get('/add-product', isAuth, adminController.getAddProduct); //isAuth is a middleware function that placed in middleware folder. This code simply check if user is authenticated to access the routes
router.post('/add-product', [
    check('title','Title should be character or number').isString().trim(),
    // check('image','URL is invalid').isURL().trim(),
    check('price','Price should be number').isNumeric().trim(),
    check('description', 'Description should be at least 5 character').isLength({min:5}).trim()
    ], isAuth, adminController.postProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); //(:) is a dynamic segment that pass to backend by url and used with req.params
router.post('/edit-product', [
    check('title','Title should be character or number').isString().trim(),
    // check('imageUrl','URL is invalid').isURL().trim(),
    check('price','Price should be number').isNumeric().trim(),
    check('description', 'Description should be at least 5 character').isLength({min:5}).trim()
    ], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
router.get('/products', isAuth, adminController.getAdminProduct);

module.exports = router;
//exports.routes = router; //another way to export router (in the imported file the code should be written like app.use('/admin', adminData.routes); the adminData is const adminData = require('./routes/admin');)