const express = require('express');

const { check } = require('express-validator'); //3rd party packages that in the end is also middleware used for validation
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth')
const User = require('../models/users')

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', [
    check('email').isEmail().withMessage('Email is invalid').normalizeEmail().trim().custom((value, {req}) => {
        return User.findOne({email: value})
        .then(user => {
            if(!user) {
                return Promise.reject('No such as email')
            }
            req.user = user;
        })
    }),
    check('password').trim().isLength({min: 6}).withMessage('Password has to be at least 6 digit character or number').isAlphanumeric().withMessage('Password can only be character or number').custom((value, {req}) => {
        return bcrypt.compare(value, req.user.password)
        .then(equalPassword => {
            //this custom validation using 3rd party package (express-validator). This line code on bycrypt.compare (provide by bcryptjs return a promise)
            //also using then block always return a promise. If the code is asynFunction (which always return a promise) then it must return a promise resolve or reject
            if(!equalPassword) {
                return Promise.reject('Password is incorrect') //this code is return reject as invalid value (resolve if its valid example 'Promise.resolve('This is valid')')
            }
        })//no need to add .catch since this error should be resolve by user and not in backend
    })
    ],authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email').isEmail().withMessage('Email is invalid').normalizeEmail().trim().custom((value, {req}) => { //validator
        return User.findOne({email: value})
        .then(user => {
            if(user) {
                //this custom validation using 3rd party package (express-validator). This line code on findOne (findOne provide by mongoDB return a promise)
                //also using then block always return a promise. If the code is asynFunction (which always return a promise) then it must return a promise resolve or reject
                return Promise.reject('Email already exist') //this code is return reject as invalid value (resolve if its valid example 'Promise.resolve('This is valid')')
            } //no need to add .catch since this error should be resolve by user and not in backend
        })
    }),
    check('password', 'Password has to be at least 6 digit with character or number only').trim().isLength({min: 6}).isAlphanumeric(),
    check('confirmPassword').trim().custom((value, {req}) => { //using custom validator provided by express-validator to throw an error with own validation
        if(value !== req.body.password) {
            throw new Error('Password does not match')
        }
        return true; //this custom validation has to return true to continue
    })
    ], authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', [
    check('email').isEmail().withMessage('Email is invalid').normalizeEmail().trim().custom((value, {req}) => {
        return User.findOne({email: value})
        .then(user => {
            if(!user) {
                return Promise.reject('No such as email')
            }
        })
    })
    ], authController.postReset);
router.get('/new-password/:token', authController.getNewPassword);
router.post('/new-password', [
    check('password', 'Password has to be at least 6 digit with character or number only').trim().isLength({min: 6}).isAlphanumeric(),
    check('confirmPassword').trim().custom((value, {req}) => { //using custom validator provided by express-validator to throw an error with own validation
        if(value !== req.body.password) {
            throw new Error('Password does not match')
        }
        return true; //this custom validation has to return true to continue
    })
    ], authController.postNewPassword);

module.exports = router;