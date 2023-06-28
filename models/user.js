import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';

class user extends Model {}

user.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  spotify_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  display_name: {
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

export default user;
