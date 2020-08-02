// Sequelize Modules
const {Sequelize, Model, DataTypes} = require('sequelize');

// Connecting to the database
const sequelize = new Sequelize('sqlite:library.db');

// Setting up the Model
class Book extends Model {}

// Initializing the Model
Book.init({
  title: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Must specify Title'
      } 
    },
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Must specify Author'
      }
    },
    allowNull: false,
  },
  genre: DataTypes.STRING,
  year: DataTypes.INTEGER,
}, {sequelize})

// Exporting the Model and sequelize
module.exports = [Book, sequelize]