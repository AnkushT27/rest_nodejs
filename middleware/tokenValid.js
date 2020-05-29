const jwt = require('jsonwebtoken');

exports.auth = (req,res,next) =>{
    let token = ''
    if(!req.get('Authorization')){
       req.isAuth = true;
      return  next();
    }
    token = req.get('Authorization').split(' ')[1]
    
    if(!token){
        req.isAuth = false;
        next()
    }
    try{
    let isValid = jwt.verify(token,'secretkey');
    console.log('isvalid--->',isValid)
    if(!isValid){
        req.isAuth = false;
        next()
    }
    req.isAuth = true;
    req.userId = isValid.userId
    next()
    }
    catch(err){
       err.statusCode = 401;
       throw err;
    }
}