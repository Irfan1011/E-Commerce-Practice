// This code is used for Sequelize
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', '', {
//     dialect: 'mysql',
//     host: 'localhost'
// });

// module.exports = sequelize;

// This code is used for mongoDB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://irfan10112001:LUItjKpyXWjSMnjV@cluster0.0xkz4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
        console.log('CONNECTED');
        _db = client.db('shop');
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDB = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;

//This code is used for SQL
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user:  'root',
//     password: '',
//     database: 'node-complete'
// });

// module.exports = pool.promise();