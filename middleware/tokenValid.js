const jwt = require('jsonwebtoken');

exports.auth = (req,res,next) =>{
    let token = req.get('Authorization').split(' ')[1]
    if(!token){
        const err = new Error('Token not Found');
        err.statusCode = 401;
        throw err;
    }
    try{
    let isValid = jwt.verify(token,'secretkey');
    console.log('isvalid--->',isValid)
    if(!isValid){
        const err = new Error('Token Invalid');
        err.statusCode = 401;
        throw err;
    }
    req.userId = isValid.id
    next()
    }
    catch(err){
        
        err.statusCode = 401;
        throw err;
    }
}