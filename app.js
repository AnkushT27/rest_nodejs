const express = require('express');
const path = require('path');
const feedroutes = require('./routes/feed');
const bodyparser = require('body-parser');
const app = express();
const sequelize = require('./util/db');
const multer = require('multer');
const uuid = require('uuid/v4');
const Post = require('./model/post')
const User = require('./model/user')
const authroutes = require('./routes/auth');
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
    next();
})
User.hasMany(Post);
Post.belongsTo(User,{});
sequelize
// .sync({force:true})
.sync()

app.use(authroutes);
app.use(feedroutes);
app.use((err,req,res,next)=>{
    console.log('now is errrormiddl',err.statusCode)
    const status = err.statusCode || 500
    if(err){
        res.status(status).json({
            message:err.message
        })
    }
});
const server = app.listen(8090);
const socketObj = require('./socket').init(server);
socketObj.on('connection',(client)=>{
    console.log('client connected');
})