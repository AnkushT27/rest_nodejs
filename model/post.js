const Sequelize = require('sequelize');
const sql = require('../util/db');

module.exports = sql.define('posts',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    content:{
        type:Sequelize.STRING,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        
    },
    author:{
        type:Sequelize.STRING,
        allowNull:false
    },
})