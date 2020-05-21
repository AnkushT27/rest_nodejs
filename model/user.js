const Sequelize = require('sequelize');
const sql = require('../util/db');

module.exports = sql.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING,
        defaultValue:'First Status'
    }
})