const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
exports.signup = (req,res,next)=>{
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    bcrypt.hash(password,12)
    .then((hashedPassword)=>{
        return  User.create({
            email:email,
            password:hashedPassword,
            name:name
        })
    })
    .then((user)=>{
        if(user){
            res.status(201)
            .json({
                message:'User Created Succeessfully'
            })
        }
    })
    .catch((err)=>{
        if(!err.statusCode){
            err.statusCode = 500;
            }
            next(err);
       })
}

exports.Login = (req,res,next)=>{
    let email = req.body.email;
    let password = req.body.password;
    let userData;
    User.findOne({where:{email:email}})
    .then((user)=>{
        userData = user
        if(!userData){
            const err = new Error('Email Not Found')
            err.statusCode = 500;
            next(err);
        }
        return bcrypt.compare(password,userData.password)
    })
    .then((isMatch)=>{
        
        if(isMatch){
            const token = jwt.sign({
                email:userData.email,
                id:userData.id.toString()
            },'secretkey',{expiresIn:'1h'})
            res.status(200).json({
                token:token,
                userId:userData.id.toString()
            })
           
        }
        else{
            const err = new Error('Password Does not Match')
            err.statusCode = 500;
            next(err);
        }
       
    })
    .catch((err)=>{
            if(!err.statusCode){
                err.statusCode  = 500;
            }
            next(err);
    })
}