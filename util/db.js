//contains db connection logic
const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('blog_app','nodejs','node',{
  host:'localhost',
 dialect:'mysql'
})

//return a promised connection pool
module.exports = sequelize;