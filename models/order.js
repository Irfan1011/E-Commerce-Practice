//This code is used with mongoose
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        product: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
})

module.exports = mongoose.model('Order', orderSchema);

//==================================================================================
//==================================================================================
//==================================================================================

//This code is used with sequelize
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     }
// })

// module.exports = Order;