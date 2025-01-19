const PDFDocument = require('pdfkit');
const midtransClient = require('midtrans-client');

const fs = require('fs');
const path = require('path');

const Product = require('../models/products');
const Order = require('../models/order');
// const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    //This controller is used when the data came from JSON files (line 49 product class model)
    // Product.fetchAll(products => {
    //     res.render('shop/index.ejs', {
    //         prods: products, 
    //         pageTitle: 'All Products', 
    //         path: '/', 
    //         hasProduct: products.length > 0, 
    //         shopCSS: true, 
    //         shopActive: true
    //     });
    // });

    //This code use with SQL
    // Product.fetchAll()
    // .then( ([rows,fieldData]) => {
    //     res.render('shop/index.ejs', {
    //         prods: rows, 
    //         pageTitle: 'All Products', 
    //         path: '/', 
    //         hasProduct: rows.length > 0, 
    //         shopCSS: true, 
    //         shopActive: true
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // //This code used with sequelize
    // Product.findAll()
    // .then(products => {
    //     res.render('shop/index.ejs', {
    //         prods: products, 
    //         pageTitle: 'All Products', 
    //         path: '/', 
    //         hasProduct: products.length > 0, 
    //         shopCSS: true, 
    //         shopActive: true
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    // This code used with mongoDB
    // Product.fetchAll()
    // .then(products => {
    //     res.render('shop/index.ejs', {
    //         prods: products, 
    //         pageTitle: 'All Products', 
    //         path: '/', 
    //         hasProduct: products.length > 0, 
    //         shopCSS: true, 
    //         shopActive: true
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    //This code used with mongoose
    const page = +req.query.page || 1; //(+) here adding information that this is a number and not string
    const ITEM_PER_PAGES = 4;
    let totalItems;

    Product.find() //mongoose provide some static ways to get data from database. find is one of the static methods to get all data from database. find is returning document array (not a cursor, but also could be adjust to cursor with '.cursor')
    .countDocuments() //countDocuments provide by mongoose to count documents on mongo db (this case is the product collection)
    .then(numProducts => {
        totalItems = numProducts;
        return Product.find()
        .skip((page-1) * ITEM_PER_PAGES) //skip is a function provide by mongoose to add pagination. This function will skip amount of items that specify on this function. Example skip(2) this means 2 items that found will be skip and only count on 3rd items so on
        .limit(ITEM_PER_PAGES) //limit is a function provide by mongoose to add pagination. This function give a limit items to display. Example limit(2) will display 2 items at a time.
    })
    .then(products => {
        res.render('shop/index.ejs', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/', 
            hasProduct: products.length > 0, 
            shopCSS: true, 
            shopActive: true,
            hasNextPage: ITEM_PER_PAGES * page < totalItems,
            hasPreviousPage: page > 1,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGES)
        });
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.getProducts = (req, res, next) => {
    // const products = Product.fetchAll(); //because fetchAll is a static function so it can be called by Product
    // res.render('shop.ejs', {
    //     prod: products, 
    //     pageTitle: 'Shop', 
    //     path: '/', 
    //     hasProduct: products.length > 0, 
    //     shopCSS: true, 
    //     shopActive: true
    // });

    //This controller is used when the data came from JSON files (line 49 product class model)
    // Product.fetchAll(products => {
    //     res.render('shop/products.ejs', {
    //         prods: products, 
    //         pageTitle: 'Shop', 
    //         path: '/products', 
    //         hasProduct: products.length > 0, 
    //         shopCSS: true, 
    //         shopActive: true
    //     });
    // });

    //This code used with SQL
    // Product.fetchAll()
    // .then( ([rows, fieldData]) => {
    //     res.render('shop/products.ejs', {
    //         prods: rows, 
    //         pageTitle: 'Shop', 
    //         path: '/products', 
    //         hasProduct: rows.length > 0, 
    //         shopCSS: true, 
    //         shopActive: true
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // //This code used with sequelize
    // Product.findAll()
    // .then(products => {
    //     res.render('shop/products.ejs', {
    //         prods: products, 
    //         pageTitle: 'Shop', 
    //         path: '/products', 
    //         hasProduct: products.length > 0, 
    //         shopCSS: true, 
    //         shopActive: true
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })
    
    // This code used with mongoDB
    // Product.fetchAll()
    // .then(products => {
    //     res.render('shop/products.ejs', {
    //         prods: products, 
    //         pageTitle: 'Shop', 
    //         path: '/products', 
    //         hasProduct: products.length > 0, 
    //         shopCSS: true, 
    //         shopActive: true
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    //This code used with mongoose
    const page = +req.query.page || 1; //(+) here adding information that this is a number and not string
    const ITEM_PER_PAGES = 4;
    let totalItems;

    Product.find() //mongoose provide some static ways to get data from database. find is one of the static methods to get all data from database. find is returning document array (not a cursor, but also could be adjust to cursor with '.cursor')
    //.select('title price -_id') //this .select provide by mongoose that allow to select only some of data on database 
    //.populate('userId') //this .populated provite by mongoose to see the entire data on userId. This can also select a spesific for example '.populate('userId', 'name') this would only select name from userId data
    .countDocuments() //countDocuments provide by mongoose to count documents on mongo db (this case is the product collection)
    .then(numProducts => {
        totalItems = numProducts;
        return Product.find()
        .skip((page-1) * ITEM_PER_PAGES) //skip is a function provide by mongoose to add pagination. This function will skip amount of items that specify on this function. Example skip(2) this means 2 items that found will be skip and only count on 3rd items so on
        .limit(ITEM_PER_PAGES) //limit is a function provide by mongoose to add pagination. This function give a limit items to display. Example limit(2) will display 2 items at a time.
    })
    .then(products => {
        res.render('shop/products.ejs', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/products', 
            hasProduct: products.length > 0, 
            shopCSS: true, 
            shopActive: true,
            hasNextPage: ITEM_PER_PAGES * page < totalItems,
            hasPreviousPage: page > 1,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGES)
        });
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.getProduct = (req, res, next) => {
    const id = req.params.productId //req.params.productId get from :productId in the routes

    //This controller is used when the data came from JSON files (line 49 product class model)
    // Product.getProductbyId(id, product => {
    //     console.log(product);
    //     res.render('shop/detail-product.ejs', {
    //         prods: product,
    //         pageTitle: 'Detail Product',
    //         path: '/products'
    //     });
    // });

    //This code used with SQL
    // Product.getProductbyId(id)
    // .then( ([rows, fieldData]) => {
    //     res.render('shop/detail-product.ejs', {
    //         prods: rows[0],
    //         pageTitle: 'Detail Product',
    //         path: '/products'
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // //This code used with sequelize
    // Product.findByPk(id)
    // .then(product => {
    //     res.render('shop/detail-product.ejs', {
    //         prods: product,
    //         pageTitle: 'Detail Product',
    //         path: '/products'
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    // This code used with mongoDB and mongoose
    Product.findById(id) //mongoose provide function findById and also autonmaticly convert cursor to objectId. In mongoDB findById is provide in model class but also need to convert cursor to objectId
    .then(product => {
        res.render('shop/detail-product.ejs', {
            prods: product,
            pageTitle: 'Detail Product',
            path: '/products',
        });
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.getCart = (req, res, next) => {
    //This code used with SQL
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProduct = []
    //         for(product of products) {
    //             const cartProductData = cart.products.find(p => p.id === product.id)
    //             if(cartProductData) {
    //                 cartProduct.push({productData: product, qty: cartProductData.qty})
    //             }
    //         }
    //         res.render('shop/cart.ejs', {
    //             pageTitle: 'Cart',
    //             path: '/cart',
    //             products: cartProduct,
    //         });
    //     })
    // })

    // //This code used with sequelize
    // req.user.getCart()
    // .then(cart => {
    //     return cart.getProducts()
    //     .then(cartItem => {
    //         res.render('shop/cart.ejs', {
    //             pageTitle: 'Cart',
    //             path: '/cart',
    //             products: cartItem,
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    // //This code used with mongodb
    // req.user.getCart()
    // .then(cart => {
    //     res.render('shop/cart.ejs', {
    //         pageTitle: 'Cart',
    //         path: '/cart',
    //         products: cart,
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    //This code used with mongoose
    req.user.populate('cart.items.productId') //populate user that have the productId on cart items
    .then(user => { //getting the user
        cart = user.cart.items; //populate the product details to cart
        res.render('shop/cart.ejs', {
            pageTitle: 'Cart',
            path: '/cart',
            products: cart,
        });
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.prodId;
    let newQuantity = 1;
    let fetchedCart;

    //This code used without database
    // Product.getProductbyId(prodId, (product) => {
    //     Cart.addToCart(prodId, product.price);
    //     res.redirect('/cart');
    // });

    // //This code used with database sequelize
    // req.user.getCart() //retrieved Cart from database asociated with user ID
    // .then(cart => {
    //     fetchedCart = cart; //Passing All Cart data (that related to user ID) to fetchedCart
    //     return cart.getProducts({where: {id:prodId} }); //return the product from cartItem database where id = prodId (return one product in array with getProducts syntax by sequelize)
    // })
    // .then(product => { //retrieved one product
    //     product = product[0]; //pull out the product from array
    //     if(product) { //if product already on cart
    //         const oldQuantity = product.CartItem.quantity;
    //         newQuantity = oldQuantity + 1;
    //     }

    //     return Product.findByPk(prodId) //if cart is empty find the product that user added
    // })
    // .then(product => { //retrieve the product
    //     return fetchedCart.addProduct(product, {through: {quantity:newQuantity} }) //add the product to cart item in database
    // })
    // .then(() => {
    //     res.redirect('/cart');
    // })
    // .catch(err => {
    //     console.log(err);
    // })
    
    //This code used with mongodb and mongoose
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    
    //This code used without database
    // Product.getProductbyId(prodId, product => {
    //     Cart.deleteProduct(prodId, product.price);
    //     res.redirect('/cart');
    // });

    // //This code used with database sequelize
    // req.user.getCart() //retrieved cart from database
    // .then(cart => {
    //     return cart.getProducts({where: {id:prodId} }); //return product from cartItem database where id = prodId and store in array use getProducts
    // })
    // .then(product => { //retrieved product in cartItem database
    //     product = product[0]; //pull out the product from array
    //     product.CartItem.destroy(); //destroy the product from CartItem database
    // })
    // .then(() => {
    //     res.redirect('/cart');
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    //This code used with mongodb and mongoose
    req.user.deleteFromCart(prodId)
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.getOrders = (req, res, next) => {
    // //This code used with sequelize
    // req.user.getOrders({include: ['products']}) //use include to pass the products into view (products here written the same as model name)
    // .then(orders => { //retrieve the order
    //     res.render('shop/orders.ejs', { //render the view
    //         pageTitle: 'Orders',
    //         path: '/orders',
    //         orders: orders //pass the order data to view
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    // //This code used with mongodb
    // req.user.getOrders() //getting all orders from database
    // .then(orders => { //retrieve the order
    //     res.render('shop/orders.ejs', { //render the view
    //         pageTitle: 'Orders',
    //         path: '/orders',
    //         orders: orders //pass the order data to view
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    //This code used with mongoose
    Order.find({'user.userId': req.user._id}) //find is one of the static methods to get all data from database. find is returning document array (not a cursor, but also could be adjust to cursor with '.cursor')
    .then(orders => { //retrieve the order
        res.render('shop/orders.ejs', { //render the view
            pageTitle: 'Orders',
            path: '/orders',
            orders: orders, //pass the order data to view
        });
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.postOrders = (req, res, next) => {
    let fetchedCart;

    // //This code used with sequelize
    // req.user.getCart() //Fetch cart
    // .then(cart => { //retrieve cart
    //     fetchedCart = cart; //set fetchedCart to cart
    //     return cart.getProducts(); //return products from cartItem database
    // })
    // .then(products => { //retrieved products
    //     return req.user.createOrder() //create Order on database using sequelize 
    //     .then(order => { //retrieve orders
    //         return order.addProducts(products.map(product => { //adding products into orderItem database (.map is JS default sytax to modified an array (input array) and output an array) the products (in products.map) is value to be stored
    //             product.orderItem = {quantity: product.CartItem.quantity}; //modified the quantity with sequelize
    //             return product; //return the product
    //         }))
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // })
    // .then(() => {
    //     fetchedCart.setProducts(null); //set the Products on CartItem database to null (empty the cart)
    // })
    // .then(() => {
    //     res.redirect('/orders');
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    // //This code used with mongodb
    // req.user.addOrder()
    // .then(result => {
    //     res.redirect('/orders');
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    //This code used with mongoose
    //since checkout is registered as controller, the post order is created by getCheckout middleware (this function is unused)
    req.user.populate('cart.items.productId') //populating user that have the productId on cart items
    .then(user => { //getting the user
        const products = user.cart.items.map(i => { //mapping the cart on user details (returning an object containing product and quantity). The .map is JS default sytax to modified an array (input array) and output an array
            return {product: { ...i.productId._doc }, quantity: i.quantity}; //this return '[{product: productData, quantity: theQuantity}]' because map always return an array, but here also give an object as return following the order model structure
        });
        const order = new Order({ //create new order
            products: products, //committed the products data
            user: { //committed the user data
                email: req.user.email,
                userId: req.user._id
            }
        })

        return order.save(); //save it to database
    })
    .then(() => {
        return req.user.clearCart(); //empty the cart
    })
    .then(() => {
        res.redirect('/orders');
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.getCheckout = (req, res, next) => {
    let totalPrice = 0;

    if(req.user.cart.items.length === 0) { //check if cart is Empty
        return next(new Error('Cart is Empty'));
    }

    let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : 'Secret'
    });

    req.user.populate('cart.items.productId') //populating user that have the productId on cart items
    .then(user => { //getting the user
        const products = user.cart.items.map(i => { //mapping the cart on user details (returning an object containing product and quantity). The .map is JS default sytax to modified an array (input array) and output an array
            return {product: { ...i.productId._doc }, quantity: i.quantity}; //this return '[{product: productData, quantity: theQuantity}]' because map always return an array, but here also give an object as return following the order model structure
        });

        const order = new Order({ //create new order
            products: products, //committed the products data
            user: { //committed the user data
                email: req.user.email,
                userId: req.user._id
            }
        })

        req.user.clearCart(); //empty the cart
        return order.save(); //save it to database
    })
    .then(order => {
        order.products.forEach(p => {
            totalPrice += p.product.price * p.quantity;
        });

        let parameter = {
            "transaction_details": {
                "order_id": order._id,
                "gross_amount": Math.ceil(totalPrice)
            },
            "credit_card":{
                "secure" : true
            },
            // "item_details": {
            //     "id": products.product._id,
            //     "price": products.product.price,
            //     "quantity": products.quantity,
            //     "name": products.product.title
            // },
            "customer_details": {
                "userId": order.user.userId,
                "email": order.user.email,
            },
            // "callback": {
            //     "finish": req.protocol + '://' + req.get('host') + '/checkout/success' //the req.protocol provide by express js returning http or https. req.get also provide by express js retuning the header. Exp req.get('Content-Type'). This case getting localhost:3000
            // }
        };
        
        return snap.createTransaction(parameter);
    })
    .then((transaction)=>{
        // transaction token
        let transactionToken = transaction.token;
        // console.log('transactionToken:',transactionToken);
        
        res.render('shop/checkout.ejs', {
            pageTitle: 'Checkout',
            path: '/checkout',
            products: cart,
            totalPrice: totalPrice,
            transactionToken: transactionToken
        });
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'invoice' + '-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoice', invoiceName); //No need to add '__dirname' on path.join() because '__dirname' goes to current path and not the root path

    Order.findById(orderId)
    .then(order => {
        if(!order) {
            return next(new Error('No Order Found'));
        }
        if(order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorized'))
        }

        //This code is read pdf document
        //This code is storing data to memory with file system (fs)
        // fs.readFile(invoicePath, (err, fileContent) => {
        //     if(err) {
        //         return next(err);
        //     }
        //     res.setHeader('Content-type', 'application/pdf');
        //     res.setHeader('Content-Disposition', 'inline: filename="' + invoiceName + '"');
        //     res.send(fileContent);
        // })

        //This code is read pdf document
        //This code is storing data in stream with file system (fs). This giving more benefit in case data to be send is bigger (then storing data to memory), this can increase performance
        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline: filename="' + invoiceName + '"');
        // file.pipe(res);

        //This code is using pdfKit 3rd party packages
        //This code is write the PDF Document
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline: filename="' + invoiceName + '"'); //this code is display the pdf inline webpage. Another option could be attachment (for example: .setHeader('Content-Disposition', 'attachment')) this will not display pdf in web but only display default browser download option
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        //This code is writing the document on pdf
        let totalPrice = 0;

        pdfDoc.fontSize(24).text('INVOICE' + ' - ' + orderId, {
            underline: true
        });
        pdfDoc.text('--------------------');
        order.products.forEach(prod => {
            totalPrice += prod.product.price * prod.quantity;
            pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + 'x' + '$' + prod.product.price);
        })
        pdfDoc.text('----------');
        pdfDoc.fontSize(20).text('Total Price: ' + totalPrice);

        //This code is end writing pdf document
        pdfDoc.end();
    })
    .catch(err => {
        return next(err);
    })
}