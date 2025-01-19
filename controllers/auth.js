const crypto = require('crypto'); //crypto is build from node js to get unique secure random value (this case for token (reset password))

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } =  require('express-validator');

const User = require('../models/users')

const transporter = nodemailer.createTransport({ //this code is used to as transporter to send email (not a middlewere)
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'irfan10112001@gmail.com',
        pass: 'xtnp ziod yryi gxri'
    }
})

exports.getLogin = (req, res, next) => {
    //const isAuthenticate = req.get('Cookie').trim().split('=')[1] //This code is getting cookies from client side. The 'req.get('Cookie')' result 'isAuthenticated=true', split it to get true only using vanilla js function
                                                                //The 'split('=')[1]' result 'true' because it split the cookie by '=' sign and split it into array '[isAuthenticated,true]' therefore adding '[1]' to get true value
                                                                //trim is a vanilla js function to remove all the whitespace if there's whitespace before the text
    
    let errorMessage = req.flash('error'); //getting error from session (connect-flash 3rd party packages) and returning any data in 'error' variable as an array then store in errorMessage variable
    let successMessage = req.flash('success'); //getting success from session (connect-flash 3rd party packages) and returning any data in 'success' variable as an array then store in successMessage variable
    let message, type;

    if(errorMessage.length > 0) { //check if there's any error or just an empty erray
        message = errorMessage; //set the message
        type = "error"
    }else if(successMessage.length > 0) { //check if there's any success or just an empty erray
        message = successMessage; //set the message
        type = "success"
    }
    
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        message: message,
        type: type,
        oldValue: {
            email: '',
            password: ''
        },
        errorValidation: []
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            message: errors.array()[0].msg,
            type: 'error',
            oldValue: {
                email: email,
                password: password,
            },
            errorValidation: errors.array()
        })
    }

    // res.cookie('isAuthenticated', 'true'); //this code is cookies that send to client side (means user can modified the cookie)
    User.findOne({email: email}) //find this user in database using findOne function provided by mongoose
    .then(user => { //getting the user
        // if(!user) { //if user isn't exist (this code is on comment because validation is check on router where all validation is there)
        //     req.flash('error', 'No such as email') //using flash 3rd party packages to store error in session and remove after send to client. The 'error' is variable to store the data and 'No such as email' is the data
        //     return res.redirect('/login');
        // }
        // bcrypt.compare(password, user.password) //comparing hash password provided by bcrypt
        // .then(equalPassword => {
        //     if(!equalPassword) { //checking if password is wrong
        //         req.flash('error', 'Password is incorrect') //using flash 3rd party packages to store error in session and remove after send to client. The 'error' is variable to store the data and 'Password is incorrect' is the data
        //         return res.redirect('/login');
        //     }
            req.session.isAuthenticate = true; //this code is sessions that send to server side
            req.session.cookie.expires = new Date(Date.now() + 3600000) //set the session expires so user still have session even if the browser is closed. The '3600000' is in milisecond
            req.session.cookie.maxAge = 3600000 //cookie.maxAge will show in developer tool the remaining time in milisecond
            req.session.user = user //after user is found, store it in incoming session request and passed it incoming request for user collection session
            req.session.save(() => {
                res.redirect('/'); //res.redirect in save() ES6 function to make sure always redirect after req.session is already written in database
            })
        // })
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error'); //getting error from session (connect-flash 3rd party packages) and returning any data in 'error' variable as an array

    if(message.length <= 0) { //check if there's any error or just an empty erray
        message = null //set message as null therefore no empty dialog is displayed on client side
    }

    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
        oldValue: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        errorValidation: []
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req); //using express-validator (3rd party packages) to check any input error

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            oldValue: {
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            },
            errorValidation: errors.array()
        })
    }

    // User.findOne({email: email}) //checking if user's email is already exist (this code is on comment because validation is check on router where all validation is there)
    // .then(userDoc => { //passing the user data
    //     if(userDoc) { //if user's email is exist
    //         req.flash('error', 'Email already exist') //using flash 3rd party packages to store error in session and remove after send to client. The 'error' is variable to store the data and 'Email already exist' is the data
    //         return res.redirect('/signup');
    //     }
        // if(password !== confirmPassword) { //if password and confirm password not match (note: this code is not used anymore since using express-validator)
        //     req.flash('error', 'Password does not match') //using flash 3rd party packages to store error in session and remove after send to client. The 'error' is variable to store the data and 'Email already exist' is the data
        //     return res.redirect('/signup');
        // }
        //return //because User.findOne is comment, no need to return hash password in then block
        bcrypt.hash(password, 12) //hash password with 12 salt secure (the more salt the secure will be, but 12 is already acceptable as secure)
        .then(hashPassword => {
            const user = new User({ //if email is not found then create new user
                email: email,
                password: hashPassword,
                cart: {items: []}
            })
            user.save();
            transporter.sendMail({ //using nodemailer transporter to send email (this sendMail return promise)
                from: 'shop@node-complete.com', // sender address
                to: email, // list of receivers
                subject: "Sign up succeeded", // Subject line
                html: "<h2>You have successfully sign up</h2>", // html body
            })
        })
        .then(user => {
            res.redirect('/login');
        })
        .catch(err => {
            // console.log(err);

            //Using Express JS Error Handling Middleware
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    // })
    // .catch(err => {
    //     console.log(err);
    // })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error'); //getting error from session (connect-flash 3rd party packages) and returning any data in 'error' variable as an array

    if(message.length <= 0) { //check if there's any error or just an empty erray
        message = null //set message as null therefore no empty dialog is displayed on client side
    }

    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message,
        oldValue: ''
    })
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/reset', {
            pageTitle: 'Reset Password',
            path: '/reset',
            errorMessage: errors.array()[0].msg,
            oldValue: email
        })
    }

    crypto.randomBytes(32, (err, buffer) => { //using crypto provide by node js to generate random value. (the 32 is byte size number to be generate) this function also have callback as err and buffer
        if(err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex'); //genereting random token using crypto (node js build random unique value) and convert to string in hex because it's generating from randomBytes function
        
        User.findOne({email: email}) //find the user
        .then(user => { //getting the user
            // if(!user) { //checking if email is not found. this code is comment because all validation is doing in route where all validation is checked
            //     req.flash('error', 'Email not found');
            //     return res.redirect('/reset');
            // }
            user.resetToken = token; //set the resetToken and resetTokenExpiration to store in database (used to protect the user reset password webpage)
            user.resetTokenExpiration = Date.now() + 3600000 //the expiration is one hour therefore giving plus 3600000 because 3600000 in ms is one hour
            return user.save()
        })
        .then(result => {
            transporter.sendMail({ //using nodemailer transporter to send email (this sendMail return promise)
                from: 'shop@node-complete.com', // sender address
                to: email, // list of receivers
                subject: "Reset Password", // Subject line
                html: `
                    <h2>You have requested to reset password</h2>
                    <p>Click this <a href="http://localhost:3000/new-password/${token}">link</a> to reset password</p>
                `, // html body
            })
            req.flash('success', 'Reset Password has send to your email');
            return res.redirect('/login');
        })
        .catch(err => {
            // console.log(err);

            //Using Express JS Error Handling Middleware
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    let message = req.flash('error'); //getting error from session (connect-flash 3rd party packages) and returning any data in 'error' variable as an array

    if(message.length <= 0) { //check if there's any error or just an empty erray
        message = null //set message as null therefore no empty dialog is displayed on client side
    }

    const token = req.params.token;

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}) //find user on database where resetToken is equal to token and resetTokenExpiration is greater then current time ({$gt} is sytax provide by mongoose means greater then)
    .then(user => {
        res.render('auth/new-password', {
            pageTitle: 'Reset Password',
            path: '/new-password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token,
            oldValue: {
                newPassword: '',
                newConfirmPassword: ''
            }
        })
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const newConfirmPassword = req.body.confirmPassword;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    const errors = validationResult(req);
    let resetUserPassword;

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/new-password', {
            pageTitle: 'Reset Password',
            path: '/new-password',
            errorMessage: errors.array()[0].msg,
            userId: userId,
            passwordToken: token,
            oldValue: {
                newPassword: newPassword,
                newConfirmPassword: newConfirmPassword
            }
        })
    }

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}, _id: userId}) //check if the resetToken and user id is match on database also expiration token is not expired
    .then(user => {
        resetUserPassword = user;
        if(newPassword !== newConfirmPassword) { //check if password and confirm password is not equal
            req.flash('error', 'Password does not match');
            return res.redirect(`/new-password/${token}`);
        }
        
        return bcrypt.hash(newPassword, 12) //hash the password
        .then(hashedPassword => { //getting the hashed password
            resetUserPassword.password = hashedPassword; //set the new password
            resetUserPassword.resetToken = undefined; //reset the token
            resetUserPassword.resetTokenExpiration = undefined; //reset the tokenExpiration
            return resetUserPassword.save()
        })
        .then(result => {
            req.flash('success', 'Success reset password');
            res.redirect('/login');
        })
    })
    .catch(err => {
        // console.log(err);

        //Using Express JS Error Handling Middleware
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}