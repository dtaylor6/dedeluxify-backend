const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  spotifyId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  displayName: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: true
  }
},
{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
});

module.exports = User;