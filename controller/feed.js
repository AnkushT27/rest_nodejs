const {validationResult} = require('express-validator/check')
const post = require('../model/post');
const fs = require('fs');
const path = require('path');
const User = require('../model/user');
const io = require('../socket');
exports.getFeeds = async (req,res,next)=>{
    let page = req.query.page|| 1;
    let perpage = 2;
    let offset = (page-1)*perpage
    let totalItems = 0;
    try{
    totalItems = await post.count({where:{userId:req.userId}})
   const posts = await post.findAll({limit:perpage,offset:offset,
    where:{userId:req.userId},
    include:[
        {
            model:User
        }
    ]
   });
  
   res.status(200).json({message:'Posts Fetched Sucessfully',posts:posts,totalItems:totalItems})
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
     next(err);
    }
  
}
exports.getFeedById = async (req,res,next)=>{
   let postId = req.params.postId;
   try{
  const postFound = await post.findByPk(postId)
  res.status(200).json({post:postFound});
   }
   catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
        }
        next(err);
   }
}

exports.updateFeed = async (req,res,next)=>{
    let postId = req.params.postId;
    console.log('postID---->',req.file)
   let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.filename
    }
    if(!imageUrl){
        const err = new Error('No File');
        err.statusCode = 422;
        throw err;
    }
    let title = req.body.title;
    let content = req.body.content;
    let oldUrl = ''; 
    try{
   const postFound = await post.findByPk(postId)
     oldUrl = postFound.imageUrl;
    const updatePost = await post.update({
            title:title,
            content:content,
            imageUrl:imageUrl
        },{where:{id:postId}})
    if(updatePost){
           if(oldUrl !== imageUrl){
               fileremover(path.join(__dirname,'../','images',oldUrl))
           }
            res.status(201).json({
                message:'Updated succcessfully'
            })
        }
    }
    catch(err){
        if(!err.statusCode){
        err.statusCode = 500;
        }
        next(err);

    }
 }

exports.deleteFeed = async (req,res,next)=>{
    let postId = req.params.postId;
    try{
  const deleted = await post.destroy({where:{id:postId}})
    if(deleted){
            res.status(201).json({
                message:'Deleted Successfully'
            })
    }
}
  catch(err){
        if(!err.statusCode){
        err.statusCode = 500;
        }
        next(err);

    }
}


exports.postFeed = async (req,res,next)=>{
       console.log('body',req.file);
       const error = validationResult(req)
       if(!error.isEmpty()){
           const err = new Error('Validation failed,Please check your input')
           err.statusCode = 422;
           throw err; 
         }
         if(!req.file){
            const err = new Error('Validation failed,Please check your input')
            err.statusCode = 422;
            throw err; 
          }
        let title = req.body.title;
        let content = req.body.content;
        console.log('req.userId',req.userId)
        try{
     const user = await  User.findByPk(req.userId)
        const addedPost = await user.createPost({
                title : title,
                content:content,
                author:'Ankush',
                imageUrl:req.file.filename
            })
        console.log('addedPost',addedPost);
        io.getIo().emit('posts',{action:'create',post:addedPost});
            res.status(201).json({
                post:{
                id:new Date().toISOString(),
                title:title,
                content:content,
                creator:addedPost.name,
                createdAt:new Date()
                }
            })
         }
        catch(err){
            if(!err.statusCode){
            err.statusCode = 500;
            }
            next(err);

        }
        
}

exports.getStatus =async (req,res,next)=>{
    let userId = req.params.userId;
    try{
  const user = await User.findByPk(userId)
        if(!user){
            const err = new Error('No User Found');
            err.statusCode = 404;
            throw err
        }
        res.status(200).json({
            status:user.status
        })
    }
    catch(err){
        if(!err.statusCode){
        err.statusCode = 500;
        }
        next(err);

    }
    
}

exports.updateStatus = async (req,res,next)=>{
    let userId = req.params.userId;
    const status = req.body.status;
    const error = validationResult(req)
    if(!error.isEmpty()){
        const err = new Error('Validation failed,Please check your input')
        err.statusCode = 422;
        throw err; 
      }
    console.log('status',status,userId)
    try{
  const updatedStatus = await  User.update({
       status:status  
    },{where:{id:userId}})
     console.log('updatedSttatus',updatedStatus);
        if(!updatedStatus){
            const err = new Error('Update Failed')
            err.statusCode = 500;
            throw err; 
        }
        res.status(201).json({
            message:"updated successfully"
        })
}
catch(err){
    if(!err.statusCode){
    err.statusCode = 500;
    }
    next(err);

}
    
}

const fileremover = (path)=>{
    fs.unlink(path,(err)=>{
        if(err){
            console.log('err',err);
        }
    })
}