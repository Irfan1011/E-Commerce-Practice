//This code used for mongoose
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // username: { //This code is not work since signup need email and password
    //     type: String,
    //     required: true,
    // },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product', //This ref means that productId reference to _id on Product models. This create such as a relation or foreign key (in SQL)
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

//This code is a customize method
userSchema.method({
    addToCart: function(product) {
        let newQuantity = 1;
        const updatedCartItem = [...this.cart.items]; //spread items to updatedCartItem

        const cartProductIndex = this.cart.items.findIndex(cp => { //findIndex used to find product items (array) on cart and return the index of the product
            return cp.productId.toString() === product._id.toString(); //the product._id is return as string by javascript not an objectId but, the cp.productId is already objectId retrived from this model.
                                                                    //Therefore toString() is added in both side to compare as string
        })

        if(cartProductIndex >= 0) { //if product is already on cart
            newQuantity = this.cart.items[cartProductIndex].quantity + 1; //Incrementing product item quantity
            updatedCartItem[cartProductIndex].quantity = newQuantity //commiting the updated quantity 
        } else {
            updatedCartItem.push({productId: product._id, quantity: newQuantity}); //push the product item into array and set quantity to newQuantity value (which is 1)
        }

        const updatedCart = {items: updatedCartItem}; //updated the items

        this.cart = updatedCart; //updated cart on schema
        return this.save() //save updated cart
    },

    deleteFromCart: function(prodId) {
        const deletedItem = this.cart.items.filter(item => { //.filter() is js vanilla and return an array that has true value also get rid the false value
            return item.productId.toString() !== prodId.toString(); //this code return true where's prodId on items is not same with prodId on parameters. Also get rid the same value (return false)
        });

        this.cart.items = deletedItem; //Empty the cart items
        return this.save() //save changes
    },

    clearCart: function() {
        this.cart = {items: []} //empty the cart
        return this.save(); //save changes
    }
});

module.exports = mongoose.model('User', userSchema);

//==================================================================================
//==================================================================================
//==================================================================================

//This code used for mongoDB
// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB;

// class User {
//     constructor(username, email, id, cart) {
//         this.username = username,
//         this.email = email,
//         this._id = id ? new mongodb.ObjectId(id) : null,
//         this.cart = cart; //this should be like {items: []}
//     }

//     save() {
//         const db = getDB();
//         let dbOp;

//         if(this._id) {
//             dbOp = db.collection('users').updateOne({_id : this._id}, {$set:this})
//         } else {
//             dbOp = db.collection('users').insertOne(this)
//         }

//         return dbOp
//         .then(result => {
//             console.log(result);
//             return result;
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     getCart() {
//         const db = getDB(); //get database
//         const prodId = this.cart.items.map(i => {
//             return i.productId; //mapping the items without modify, just need to get the product Id in an array to stored $in provide by mongodb. The .map is JS default sytax to modified an array (input array) and output an array
//         })
//         return db.collection('products').find({_id: {$in: prodId}}).toArray() //find() is function provide by mongoDB to find all data on database and return a cursor (object document). This could also be spesific for example find({title: 'A'}) this mean find title contains A
//                                                                             //toArray() is a function provide by javascript to transform any object into array (this also include the cursor) therefore .then and .catch can be place as a promise.
//         .then(products => { //getting all products detail on cart
//             return products.map(p => { //modify the cart to display the products detail but including the quantity
//                 return {
//                     ...p, //using spread operator to spread the products detail
//                     quantity: this.cart.items.find(i => { //adding quantity details. Also find the quantity in cart items
//                         return i.productId.toString() === p._id.toString(); //returning product cart with same prodId
//                     }).quantity //select the quantity only
//                 }
//             })
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     deleteFromCart(prodId) {
//         const deletedItem = this.cart.items.filter(item => { //.filter() is js vanilla and return an array that has true value also get rid the false value
//             return item.productId.toString() !== prodId.toString(); //this code return true where's prodId on items is not same with prodId on parameters. Also get rid the same value (return false)
//         });

//         const db = getDB();
//         return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: {items: deletedItem}}}); //updating the database on users collection with the id that match on this class id. Also set the value base on deletedItem variable
//     }

//     addToCart(product) {
//         const db = getDB(); //get Database
//         let newQuantity = 1;
//         const updatedCartItem = [...this.cart.items]; //spread items to updatedCartItem

//         const cartProductIndex = this.cart.items.findIndex(cp => { //findIndex used to find product items (array) on cart and return the index of the product
//             return cp.productId.toString() === product._id.toString(); //the product._id is return as string by javascript not an objectId but, the cp.productId is already objectId retrived from this model.
//                                                                     //Therefore toString() is added in both side to compare as string
//         })

//         if(cartProductIndex >= 0) { //if product is already on cart
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1; //Incrementing product item quantity
//             updatedCartItem[cartProductIndex].quantity = newQuantity //commiting the updated quantity 
//         } else {
//             updatedCartItem.push({productId: new mongodb.ObjectId(product._id), quantity: newQuantity}); //push the product item into array and set quantity to newQuantity value (which is 1)
//         }

//         const updatedCart = {items: updatedCartItem}; //updated the items

//         return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: updatedCart}}); //update the cart
//     }

//     addOrder() {
//         const db = getDB();
//         return this.getCart() //getting all Cart information that has products detail
//         .then(products => { //getting the products detail including the quantity on cart
//             const order = { //creating new variable that contain items and user information
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectId(this._id), //this code is converting user id if the id isn't an object data type (this case this code works also the 'this._id')
//                     name: this.username,
//                 }
//             };
//             return db.collection('orders').insertOne(order) //creating order collection and add order base on order variable
//         })
//         .then(result => {
//             this.cart = {items: []}; //empty the cart into empty array
//             return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: {items: []}}}) //empty the cart on database to empty array
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     getOrders() {
//         const db = getDB();
//         return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray()
//     }

//     static findById(userId) {
//         const db = getDB();
//         return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}) //findOne mongoDB returning a promise not a cursor (object document). Therefore no need to add .next() to return a document
//         .then(user => {
//             console.log(user);
//             return user;
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }
// }

// module.exports = User;

//==================================================================================
//==================================================================================
//==================================================================================

// This code used for sequelize
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         allowNull: false,
//         primaryKey: true,
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
// });

// module.exports = User;