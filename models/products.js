//This code used for mongoose
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // imageUrl: {
    //     type: String,
    //     required: true
    // },
    image: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', //This ref means that userId reference to _id on User models. This create such as a relation or foreign key (in SQL)
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);

//==================================================================================
//==================================================================================
//==================================================================================

// // This code used for mongoDB
// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB;

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null; //This is ternary operation (SHOULD_I_DO?YES:NO -> like if else. The first one is condition seperate by "?" for meet codition and ":" as else) 
//                                                         //The id (on true ternary operator condition) sould be in objectId because mongodb need to compare the prodId with objectId _id and not string prodId
//         this.userId = userId
//     }

//     save() {
//         const db = getDB();
//         let dbOp;

//         if(this._id) {
//             dbOp = db.collection('products').updateOne({_id : this._id}, {$set: this}) //updateOne is updating one data collection in database. The first argument is which data and the second argument is what's the new data
//                                                                                     // The second argument could also set to a spesific data for example {$set: {title: this.title, price: this.price}} this mean only update title and price for the data that found
//         } else {
//             dbOp = db.collection('products').insertOne(this)
//         }

//         return dbOp
//         .then(result => {
//             console.log(result);
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }

//     static fetchAll() {
//         const db = getDB();
//         return db.collection('products').find().toArray() //find() is function provide by mongoDB to find all data on database and return a cursor (object document). This could also be spesific for example find({title: 'A'}) this mean find title contains A
//                                                             //toArray() is a function provide by javascript to transform any object into array (this also include the cursor) therefore .then and .catch can be place as a promise.
//         .then(result => {
//             console.log(result);
//             return result;
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     static findById(prodId) {
//         const db = getDB();
//         return db.collection('products').find({_id : new mongodb.ObjectId(prodId)}).next() //comparing id in mongodb has to be an objectID because mongodb by default create an id as an objectID. Therefore prodId as string has to be an objectId
//                                                                                             //find is returning cursor object document, therefore use next() javascript function to return the last document that found also this could attach a promise
//         .then(product => {
//             console.log(product);
//             return product;
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     static deleteById(prodId) {
//         const db = getDB();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
//         .then(result => {
//             console.log(result);
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }
// }

// module.exports = Product;

//==================================================================================
//==================================================================================
//==================================================================================

// This code used for sequelize
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         allowNull: false,
//         primaryKey: true,
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
// });

// module.exports = Product;

//==================================================================================
//==================================================================================
//==================================================================================

//This code is used without database (using filesystem / SQL)
// // const fs = require('fs'); //fs used to read or write files on project
// // const path = require('path'); //path used to determine the path in project

// const db = require('../util/database');
// const Cart = require('./cart');

// //const products = []; //this array is to save the products data

// //this path used to addressing the file location
// // const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

// //this function use for read file in path (p) and can be used in product class model
// // const getReadFile = (cb) => {
// //     fs.readFile(p, (err, fileContent) => {
// //         if(err) {
// //             cb([]);
// //         }
// //         else {
// //             cb(JSON.parse(fileContent));
// //         }
// //     });
// // };

// module.exports = class Product {
//     constructor(id, titleParameter, imageURL, description, price) {
//         this.id = id;
//         this.title = titleParameter;
//         this.imageURL = imageURL;
//         this.description = description;
//         this.price = price;
//     }

//     save() {
//         // products.push(this.title); //this code will push the title data to global products array

//         // const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
//         // fs.readFile(p, (err, fileContent) => {
//         //     let products = [];
//         //     if(!err) {
//         //         products = JSON.parse(fileContent);
//         //     }
//         //     products.push(this);
//         //     fs.writeFile(p, JSON.stringify(products), (err) => {
//         //         console.log(err);
//         //     });
//         // });
        
//         //This algorithm used to insert or update data (writing to JSON files)
//         // getReadFile(products => {
//         //     //This is an update data
//         //     if(this.id) {
//         //         const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//         //         const updatedProduct = [...products];
//         //         updatedProduct[existingProductIndex] = this;
//         //         fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
//         //             console.log(err);
//         //         });
//         //     }
//         //     else {
//         //     //This is an adding data
//         //         this.id = Math.random().toString();
//         //         products.push(this);
//         //         fs.writeFile(p, JSON.stringify(products), (err) => {
//         //             console.log(err);
//         //         });
//         //     }
//         // });

//         return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', [this.title, this.price, this.description, this.imageURL]);

//     } //this is method and not a function

//     static deleteById(id) {
//         //This function used to delete products from JSON files, also to remove the product from cart if the product is in cart
//         // getReadFile(products => {
//         //     const product = products.find(p => p.id === id);
//         //     const updatedProduct = products.filter(p => p.id !== id);
//         //     fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
//         //         if(!err) {
//         //             Cart.deleteProduct(product.id, product.price); //delete the product from cart
//         //         }
//         //     });
//         // })
        
//         //This function is only  delete product from products. But need to delete also from cart since the product is empty
//         // getReadFile(products => {
//         //     const deletedProduct = products.filter(p => p.id !== id);
//         //     fs.writeFile(p, JSON.stringify(deletedProduct), (err) => {
//         //         if(err) {
//         //             console.log(err)
//         //         }
//         //     });
//         // })
//     }

//     //This method is used without database (JSON files), the (//) indicate the code that run at a time, double (//) means code writed before the single (//)
//     // static fetchAll(cb) {
//     //     // return products //this will return the global array

//     //     // const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
//     //     // fs.readFile(p, (err, fileContent) => {
//     //     //     if(err) {
//     //     //         cb([]);
//     //     //     }
//     //     //     else {
//     //     //         cb(JSON.parse(fileContent));
//     //     //     }
//     //     // });

//     //     getReadFile(cb);
//     // } //this is static function. Static refers to this class which means Product class

//     static fetchAll() {
//         return db.execute('SELECT * FROM products');
//     }

//     //This method is used to find product ID
//     // static getProductbyId(id, cb) {
//     //     getReadFile(products => {
//     //         const productId = products.find(p => p.id === id);
//     //         cb(productId);
//     //     })
//     // }

//     static getProductbyId(id) {
//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//     }
// }