const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('album_preferences', {
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
        allowNull: false
      },
      track_preferences: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('album_preferences');
  }
};
