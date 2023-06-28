const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('album_preferences', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uri: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false
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
