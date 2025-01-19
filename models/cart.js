const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('Cart', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = Cart;

//This code is used without database (using filesystem)
// const fs = require('fs');
// const path = require('path');

// const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

// module.exports = class Cart {
//     static addToCart(id, productPrice) {
//         //Fetch the previous cart
//         fs.readFile(p, (err, fileContent) => {  
//             let cart = { products: [], totalPrice: 0};
//             if (!err) {
//                 cart = JSON.parse(fileContent);
//             }

//             //Analyze the cart / Find existing product
//             const existingProductIndex = cart.products.findIndex(prod => prod.id===id);
//             const existingProduct = cart.products[existingProductIndex];
//             //Add new product / Increase the quantity
//             let updatedProduct;
//             if (existingProduct) {
//                 updatedProduct = { ...existingProduct };
//                 updatedProduct.qty++;
//                 cart.products[existingProductIndex] = updatedProduct;
//             } else {
//                 updatedProduct = { id: id, qty: 1 };
//                 cart.products = [ ...cart.products, updatedProduct ];
//             }

//             cart.totalPrice += +productPrice; // the (+) in +productPrice use to convert string type to float type
//             fs.writeFile(p, JSON.stringify(cart), err => {
//                 console.log(err);
//             })
//         });
//     }

//     static deleteProduct(id, productPrice) {
//         fs.readFile(p, (err, fileContent) => {
//             if(err) {
//                 return err;
//             }
//             const updatedCart = { ...JSON.parse(fileContent) };
//             const product = updatedCart.products.find(p => p.id === id);

//             if(!product) {
//                 console.log('Product is not on Cart!')
//                 return;
//             }

//             updatedCart.products = updatedCart.products.filter(p => p.id !== id);

//             updatedCart.totalPrice = updatedCart.totalPrice - productPrice * product.qty;
//             fs.writeFile(p, JSON.stringify(updatedCart), err => {
//                 console.log(err);
//             })
//         });
//     }

//     static getCart(cb) {
//         fs.readFile(p, (err, fileContent) => {
//             if(err) {
//                 cb(err);
//             } else {
//                 cb(JSON.parse(fileContent));
//             }
//         })
//     }
// };