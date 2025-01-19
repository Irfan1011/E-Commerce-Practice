const express = require('express');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const {doubleCsrf} = require('csrf-csrf');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const multer = require('multer');

const path = require('path');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars')

//const rootDir = require('./util/path'); //elegant way to write path

const app = express();
const store = new MongoDBStore({
    uri: 'mongodb+srv://irfan10112001:LUItjKpyXWjSMnjV@cluster0.0xkz4.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0',
    collection: 'sessions'
})

//using some csrf-csrf documentation
const {doubleCsrfProtection} = doubleCsrf({ 
    getSecret: () => "Secret",
    getTokenFromRequest: (req) => req.body._csrf,
    // __HOST and __SECURE are blocked in chrome, change name
    cookieName: '__APP-psfi.x-csrf-token',
});

// const db = require('./util/database'); //kinda same like .env in Laravel (this case is for testing only)
// const dbTables = require('./util/dbTables'); //kinda like migration in Laravel (this case is for testing only)

// //This code is used for sequelize
// const sequelize = require('./util/database');

// const Product = require('./models/products');
const User = require('./models/users');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

//Controller and Routes
const errorController = require('./controllers/errors');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const isAuth = require('./middleware/is-auth');

//This code is used for mongoDB
// const mongoConnect = require('./util/database').mongoConnect;
// const getDB = require('./util/database').getDB;

//This code is used for mongoose
const mongoose = require('mongoose');

//Testing if database conneted to project (Using SQL)
// db.execute(dbTables.createProductTable);
// db.execute(dbTables.insertProduct);
// db.execute('SELECT * FROM products')
// .then( result => {
//     console.log(result);
// })
// .catch(err => {
//     console.log(err);
// });

// This code is import templating engine
app.engine('handlebars', expressHbs({layoutDir: 'views/layouts', defaultLayout: 'main-layout'}));
app.set('view engine', 'handlebars');
app.set('view engine', 'pug'); //This engine used for pug extention file
app.set('view engine', 'ejs'); //This engine used for ejs extention file

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        const unique = Date.now();
        cb(null, unique + '-' + file.originalname)
    },
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image')); //single('image') because on add-product ejs file named as image
app.use(bodyParser.urlencoded({extended: true})); //used for getting input to post and get ro read the input from user. Otherwise user data is undefined
app.use(express.static(path.join(__dirname, 'public'))); //used for views href. Example for seperate css file with href
app.use('/images', express.static(path.join(__dirname, 'images'))); //used for views href. This case used to display images. adding '/images' because in the database image path goes to 'images/image.jpg'. But the image should be 'image.jpg' therefor need to add '/images' to go into the files
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false, store: store})) //using a session provide by express js third party packages. 
                                                                                            //resave set to false because no need to resave every incoming request to session (faster the server). 
                                                                                            //Also saveUninitialize set to false to ensure no session is to be saved
                                                                                            //the left 'store' is the instance of the sessions. The right 'store' is value that sets to mongoDBStore
app.use(cookieParser('supersecret')); //this code used to get the cookie secret for csrf-csrf
app.use(doubleCsrfProtection); //this code has to be after session is created but before middleware is registered (Any non GET routes registered after this will be considered "protected")
app.use(flash()); //register 3rd party flash packages as function to received data from session and transfer to client then remove from session after data is transfered

// //This middleware is storing the dummy usfer into incoming request
// //This code used with sequlize
// app.use((req, res, next) => {
//     User.findByPk('478c728f-1c06-43a6-9258-071a7f6c2e07') //find this user in database
//     .then(user => {
//         req.user = user; //after user is found, store it in incoming request and passed it into controller (incoming request for user)
//         next();
//     })
//     .catch(err => {
//         console.log(err);
//     })
// })

//This middleware is storing the dummy user into incoming request
//This code used with mongodb
// app.use((req, res, next) => {
//     User.findById('673c50aae3ef7e860dcd8bd1') //find this user in database using findById function provided at user's model
//     .then(user => {
//         req.user = new User(user.username, user.email, user._id, user.cart); //after user is found, store it in incoming request and passed it into controller (incoming request for user), creating new User here so the method on users model is allowed in controller (the addToCart)
//         next();
//     })
//     .catch(err => {
//         console.log(err);
//     })
// })

// //This middleware is storing the dummy user into incoming request
// //This code used with mongoose
// //This code works without sessions
// app.use((req, res, next) => {
//     User.findById('674854edfbd35807f47e7cbb') //find this user in database using findById function provided by mongoose
//     .then(user => {
//         req.user = user //after user is found, store it in incoming request and passed it into controller (incoming request for user)
//         next();
//     })
//     .catch(err => {
//         console.log(err);
//     })
// })

// //This middleware is storing the dummy user into incoming request
// //This code used with mongoose
// //This code works with sessions
app.use((req, res, next) => {
    if(!req.session.user) { //checking if there's user need this middlewere, if it's not just passing next middlewere
        return next();
    }
    User.findById(req.session.user._id) //find this user in database using findById function provided by mongoose.The req.session.user._id is a collection document on mongodb that store user id
    .then(user => {
        if(!user) {
            throw new Error('User is not found');
        }
        req.user = user //after user is found, store it in incoming request and passed it into controller (incoming request for user)
        next();
    })
    .catch(err => {
        // const error = new Error(err);
        // error.httpStatusCode = 500;
        // return next(error);

        next(new Error(err)) //altervative of 'throw new Error(err)'. using next(error) to get into express error handling middleware.
    })
})

//this middleware used to store authentication and csrfToken to locals (store in application website inspection)
app.use((req, res, next) => { 
    res.locals.isAuthenticated = req.session.isAuthenticate; //this code is getting isAuthenticate session from server side and store it in res.local.isAuthenticated. this respond code is stuck on website application inspection
    res.locals.csrfToken = req.csrfToken(); //this code is generate csrfToken from csrrf-csrf 3rd party packages. This generated token pass to view therefore using res.locals
    next();
})

// //This code use to route the controller
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use('/500', isAuth, errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render('/500' => {})//Other alternative
    console.log(error);
    res.redirect('/500');
});

// This code is without controller
// app.use((req, res, next) => {
//     //res.status(404).sendFile(path.join(__dirname, '../', 'views', 'notFound.html')); //this is also allowed without rootDir
//     //res.status(404).sendFile(path.join(rootDir, 'views', 'notFound.html')); //elegant way to use rootDir
//     res.status(404).render('notFound.ejs', {pageTitle: 'Not Found'}); //sending pug or handlebars extention on views with render and attributes send to views
// });

// // This code is used for sequelize relational table
// //This code initialize table asociation (table relation) on database
// User.hasMany(Product); //oneToMany Relation
// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); //oneToMany Relation
// User.hasOne(Cart); //oneToOne Relation
// Cart.belongsTo(User); //oneToOne Relation
// Cart.belongsToMany(Product, {through: CartItem}); //manyToMany Relation
// Product.belongsToMany(Cart, {through: CartItem}); //manyToMany Relation
// User.hasMany(Order); //oneToMany Relation
// Order.belongsTo(User); //oneToMany Relation
// Order.belongsToMany(Product, {through: OrderItem}); //manyToMany Relation
// Product.belongsToMany(Order, {through: OrderItem}); //manyToMany Relation

// // This code is used for sequileze
// // sequelize.sync({force: true}) //force here use to force drop all the existing table in the database and create all new tables
// sequelize.sync() //this empty sync is create table if tables are not exists and run anyway if one or more table already in the database
// .then(() => {
//     // console.log(result);
//     // Cart.create({userId: '478c728f-1c06-43a6-9258-071a7f6c2e07'}) //Dummy cart data
//     return User.findByPk('478c728f-1c06-43a6-9258-071a7f6c2e07')
// })
// .then(user=> { //this user passed by .then above that return user; as promise
//     if(!user) {
//         return User.create({name: 'Irfan', email: 'irfan10112001@gmail.com'});
//     }
//     return user; //in this case this return is promise because .then always return a promise
//     // return Promise.resolve(user); //this code used if the return is not a promise (because to add code .then need a promise as a return)
// })
// .then(user => { //this user passed by .then above that return user; as promise
//     // console.log(user);
//     app.listen(3000);
// })
// .catch(err => {
//     console.log(err)
// });

// // This code is used for mongoDB
// mongoConnect(client => {
//     // getDB().collection('users').insertOne({username: "Irfan", email: "Irfan10112001@gmail.com"}) //creating dummy user
//     app.listen(3000);
// })

//This code is used for mongoose
mongoose.connect('mongodb+srv://irfan10112001:LUItjKpyXWjSMnjV@cluster0.0xkz4.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
.then(result => {
    User.findOne()
    .then(user => {
        if(!user) {
            const user = new User({
                username: 'Irfan', 
                email: 'Irfan10112001@gmail.com',
                cart: {
                    items: []
                }
            })
            user.save();
        }
    })
    app.listen(3000);
    console.log('CONNECTED');
})
.catch(err => {
    console.log(err);
})

// app.listen(3000); //used without sequelize;