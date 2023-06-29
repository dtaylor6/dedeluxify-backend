import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';

class album_preference extends Model {}

album_preference.init({
  album_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: false,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'user_id'
    }
  },
  num_tracks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  track_preferences: {
    // Char for each track where '0' = skip and '1' = play
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[01]+$/g
    }
  }
},
{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'album_preference'
},
{
  validate: {
    numPreferencesMatchesNumTracks() {
      if (this.num_tracks !== this.track_preferences.length) {
        throw new Error('Number of track preferences set must match the number of tracks in the album!');
      }
    }
  }
}
);

export default album_preference;
