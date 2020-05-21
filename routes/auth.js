const express = require('express');
const routes = express.Router();
const auth = require('../controller/auth');
const User = require('../model/user');
const {body,check} = require('express-validator/check');

routes.put('/signup',
body('email').trim().normalizeEmail().isEmail()
.custom((value,{req})=>{
    User.findOne({where:{email:value}})
    .then((user)=>{
        if(user){
            return Promise.reject('user exsists');
        }
    })
    .catch((err)=>{
        console.log('err',err)
    })
}),
body('password').isAlphanumeric().isLength({min:6}),
body('name').isEmpty(),
auth.signup);
routes.post('/login',
body('email').trim().normalizeEmail().isEmail(),
body('password').trim().isAlphanumeric().isLength({min:6}),
auth.Login)
module.exports = routes;