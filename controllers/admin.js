const { validationResult } = require('express-validator');

const Product = require('../models/products');
const fileHelper = require('../util/file');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product.ejs', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        prodCSS: true,
        prodActive: true,
        editing: false,
        message: '',
        hasError: false,
        errorValidation: [],
    });
};

exports.postProduct = (req, res, next) => {
    const title = req.body.title;
    // const imageURL = req.body.imageUrl;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);

    //This controller is used when the data came from JSON files (line 67 product class model)
    // const product = new Product(null, title, imageURL, description, price);
    // product.save(); //because save is a method it can't be called by Product with capital P
    // res.redirect('/');

    //This code used with SQL
    // const product = new Product(null, title, imageURL, description, price); //create new product to product model constructor
    // product.save()
    // .then(() => {
    //     res.redirect('/');
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    //This code used with sequelize
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageURL,
    //     description: description,
    //     userId: req.user.id // incoming request user id from database (this function is created at app.js middleware)
    // })
    
    //another way regarding sequelize asociation to store related column information. The createProduct (create is default syntax, Product comes from the table asociation)
    // req.user.createProduct({
    //     title: title,
    //     price: price,
    //     imageUrl: imageURL,
    //     description: description,
    // })
    // .then(() => {
    //     console.log('Product Created');
    //     res.redirect('/admin/products');
    // }).catch(err => {
    //     console.log(err);
    // });

    //This code used with mongoDB
    // const product = new Product(title, price, description, imageURL, null, req.user._id); //req.user._id passed by middleware at auth.js controller (postLogin). Where userId is stored in req.user
    // product.save()
    // .then(() => {
    //     console.log('Product Created');
    //     res.redirect('/admin/products');
    // }).catch(err => {
    //     console.log(err);
    // });

    //This code used with mongoose
    if(!errors.isEmpty()) { //check if any errors occur
        return res.status(422).render('admin/edit-product.ejs', {
            pageTitle: 'Add Product', 
            path: '/admin/add-product', 
            prodCSS: true,
            prodActive: true,
            editing: false,
            hasError: true,
            message: errors.array()[0].msg,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorValidation: errors.array(),
        });
    }

    if(!image) { //check if image is undefined (wrong type of files)
        return res.status(422).render('admin/edit-product.ejs', {
            pageTitle: 'Add Product', 
            path: '/admin/add-product', 
            prodCSS: true,
            prodActive: true,
            editing: false,
            hasError: true,
            message: 'Image must type of PNG/JPG/JPEG',
            product: {
                title: title,
                price: price,
                description: description
            },
            errorValidation: [],
        });
    }

    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        image: '/' + image.path, //this will store the image path to database, adding '/' to make sure creating new path when displaying image (not the current path '/admin/images/image.jpg')
        userId: req.user._id,
    }); //the left of column is come from model constructor, while the right after column come from this middleware
    product.save() //save() provided by mongoose, therefore no need to create manual save method in models just like mongodb
    .then(() => {
        console.log('Product Created');
        res.redirect('/admin/products');
    }).catch(err => {
        // console.log(err);
        // res.redirect('/500');

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit; //req.qurey used to accept the query in url that passed in view (example: ?params=value&params2=value2)
    const prodId = req.params.productId; //req.params used to call the dynamic id passed in route

    //This code used with SQL
    // Product.getProductbyId(prodId, product => {
    //     res.render('admin/edit-product.ejs', {
    //         pageTitle: 'Edit Product',
    //         path: '/edit-product',
    //         editing: editMode,
    //         product: product,
    //     });
    // });

    //This code used with sequelize
    // Product.findByPk(prodId)
    // .then(product => {
    //     res.render('admin/edit-product.ejs', {
    //         pageTitle: 'Edit Product',
    //         path: '/edit-product',
    //         editing: editMode,
    //         product: product,
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // //Another way regarding sequelize asociation
    // req.user.getProduct({where: {id: prodId} })
    // .then(products => {
    //     const product = products[0];
    //     res.render('admin/edit-product.ejs', {
    //         pageTitle: 'Edit Product',
    //         path: '/edit-product',
    //         editing: editMode,
    //         product: product,
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // This code used with mongoDB and mongoose
    Product.findById(prodId)
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()) { //set protection authorization
            return res.redirect('/admin/products');
        }
        res.render('admin/edit-product.ejs', {
            pageTitle: 'Edit Product',
            path: '/edit-product',
            editing: editMode,
            product: product,
            message: '',
            hasError: false,
            errorValidation: [],
        });
    })
    .catch(err => {
        // console.log(err);
        
        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });    
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    // const imageURL = req.body.imageUrl;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    
    // This code used with SQL
    // const updateProduct = new Product(prodId, title, imageURL, description, price);
    // updateProduct.save();
    // res.redirect('/admin/products');

    // //This code used with sequelize
    // Product.findByPk(prodId)
    // .then(product => {
    //     product.title = title,
    //     product.imageUrl = imageURL,
    //     product.price = price,
    //     product.description = description;
    //     return product.save();
    // })
    // .then(() => { //this .then() come from the second promise on product.save() (the product.save() return a promise therefore .then is allow here)
    //     console.log('Product Updated');
    //     res.redirect('/admin/products');
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // This code used with mongodb
    // const product = new Product(title, price, description, imageURL, prodId)
    // product.save()
    // .then(() => {
    //     console.log('Product Updated');
    //     res.redirect('/admin/products');
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    //This code used with mongoose
    if(!errors.isEmpty()) { //check if any validation errors occur
        return res.status(422).render('admin/edit-product.ejs', {
            pageTitle: 'Edit Product',
            path: '/edit-product',
            editing: true,
            hasError: true,
            product: {
                _id: prodId,
                title: title,
                price: price,
                description: description
            },
            message: errors.array()[0].msg,
            errorValidation: errors.array(),
        });
    }

    Product.findById(prodId) //find the product in database
    .then(product => { //getting the product
        if(product.userId.toString() !== req.user._id.toString()) { //set protection authorization
            return res.redirect('/admin/products');
        }
        product.title = title, //set all new product value
        product.price = price,
        product.description = description;
        if(image) { //Only update image if user wants to update new image
            fileHelper.deleteFile(product.image) //deleting old image on project folder (not database) but using database (product.image) to return the path
            product.image = '/' + image.path; //update the image path to database
        }
        return product.save() //updating the product 
        .then(() => {
            console.log('Product Updated');
            res.redirect('/admin/products');
        })
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    //This code used with SQL
    // Product.deleteById(prodId);
    // res.redirect('/admin/products');

    // //This code used with sequelize
    // Product.findByPk(prodId)
    // .then(product => {
    //     return product.destroy();
    // })
    // .then(() => {
    //     console.log('Product Deleted');
    //     res.redirect('/admin/products');
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // This code used with mongodb
    // Product.deleteById(prodId)
    // .then(() => {
    //     console.log('Product Deleted');
    //     res.redirect('/admin/products');
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    //This code used with mongoose
    //Product.findByIdAndDelete(prodId) //findByIdAndDelete is provide by mongoose to find product base on their objectId and remove it from database
    // Product.deleteOne({_id: prodId, userId: req.user._id}) //set authorization using deleteOne that provide by mongoose to find product base on the option that set ({_id} from database equal to {prodId} in this code) and remove it from database
    // .then(() => {
    //     console.log('Product Deleted');
    //     res.redirect('/admin/products');
    // })
    // .catch(err => {
    //     // console.log(err);

    //     //Using Express JS Error Handling Middleware
    //     const error = new Error(err);
    //     error.httpStatusCode = 500;
    //     return next(error);
    // });

    Product.findById(prodId)
    .then(product => {
        if(!product) {
            return next(new Error('Product Not Found'));
        }
        fileHelper.deleteFile(product.image); //deleting image from project folder
        return Product.deleteOne({_id: prodId, userId: req.user._id}) //set authorization using deleteOne that provide by mongoose to find product base on the option that set ({_id} from database equal to {prodId} in this code) and remove it from database
    })
    .then(() => {
        console.log('Product Deleted');
        res.redirect('/admin/products');
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getAdminProduct = (req, res, next) => {
    //This code used with SQL
    // Product.fetchAll(product => {
    //     res.render('admin/products.ejs', {
    //         prods: product,
    //         pageTitle: 'Admin Product',
    //         path: '/admin/products'
    //     });
    // });
    
    // //This code used with sequelize
    // // Product.findAll() //This code is allow to fetch all product
    // req.user.getProducts() //This code is allow to fetch product from specific user
    // .then(product => {
    //     res.render('admin/products.ejs', {
    //         prods: product,
    //         pageTitle: 'Admin Product',
    //         path: '/admin/products'
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // This code used with mongoDB
    // Product.fetchAll()
    // .then(products => {
    //     res.render('admin/products.ejs', {
    //         prods: products,
    //         pageTitle: 'Admin Product',
    //         path: '/admin/products'
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    //This code used with mongoose
    const page = +req.query.page || 1; //(+) here adding information that this is a number and not string
    const ITEM_PER_PAGES = 4;
    let totalItems;

    Product.find({userId: req.user._id}) //mongoose provide some static ways to get data from database. find is one of the static methods to get all data from database. find is returning document array (not a cursor, but also could be adjust to cursor with '.cursor')
    .countDocuments() //countDocuments provide by mongoose to count documents on mongo db (this case is the product collection)
    .then(numProducts => {
        totalItems = numProducts;
        return Product.find({userId: req.user._id})
        .skip((page-1) * ITEM_PER_PAGES) //skip is a function provide by mongoose to add pagination. This function will skip amount of items that specify on this function. Example skip(2) this means 2 items that found will be skip and only count on 3rd items so on
        .limit(ITEM_PER_PAGES) //limit is a function provide by mongoose to add pagination. This function give a limit items to display. Example limit(2) will display 2 items at a time.
    })
    .then(products => {
        res.render('admin/products.ejs', {
            prods: products,
            pageTitle: 'Admin Product',
            path: '/admin/products',
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