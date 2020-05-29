const express = require('express');
const path = require('path');
const fs = require('fs');
// const feedroutes = require('./routes/feed');
const bodyparser = require('body-parser');
const app = express();
const sequelize = require('./util/db');
const multer = require('multer');
const uuid = require('uuid/v4');
const Post = require('./model/post')
const User = require('./model/user')
const auth = require('./middleware/tokenValid');
// const authroutes = require('./routes/auth');
const graphqlhttp = require('express-graphql');
const schema = require('./graphql/schema')
const resolver = require('./graphql/resolver')
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,uuid()+'_'+file.originalname);
    }
});
const filefilter = (req,file,cb)=>{
    if(file.mimetype==="image/png"||
    file.mimetype==="image/jpeg"||
    file.mimetype==="image/jpg"){
          cb(null,true);
    }
    else{
        cb(null,false);
    }
}
app.use(bodyparser.json());
app.use(multer({storage:fileStorage,fileFilter:filefilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods',' GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method === 'OPTIONS'){
        res.status(200).json({})
    }
    next();
})
User.hasMany(Post);
Post.belongsTo(User,{});
sequelize
// .sync({force:true})
.sync()

// app.use(authroutes);
// app.use(feedroutes);

app.use((err,req,res,next)=>{
    console.log('now is errrormiddl',err.statusCode)
    const status = err.statusCode || 500
    if(err){
        res.status(status).json({
            message:err.message
        })
    }
});
app.use(auth.auth);
app.put('/post-images',(req,res,next)=>{
    if(!req.isAuth){
        const error = new Error('User unauthorized');
        error.code = 401;
        throw error;
    }
    if(!req.file){
        res,status(200).json({filepath:''})
    }
    if(req.body.oldPath){
        fileremover(path.join(__dirname,'../','images',req.body.oldPath))
    }
    res.status(201).json({filepath:req.file.filename})
})


app.use('/graphql',graphqlhttp({schema:schema,rootValue:resolver,graphiql:true
,formatError(err){
    if(!err.originalError){
        return err
    }
    const data = err.originalError.data;
    const status = err.originalError.status;
    const message = err.message;
    return {
        data:data,
        status:status,
        message:message
    }
}
}))
const fileremover = (path)=>{
    fs.unlink(path,(err)=>{
        if(err){
            console.log('err',err);
        }
    })
}
const server = app.listen(8090);
// const socketObj = require('./socket').init(server);
// socketObj.on('connection',(client)=>{
//     console.log('client connected');
// })