import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('users', {
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
  });
}
export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('users');
}