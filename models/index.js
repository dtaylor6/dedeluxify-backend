import user from './user.js';
import album_preference from './album_preference.js';

user.hasMany(album_preference, {
  as: 'album_preferences',
  onDelete: 'CASCADE'
});
album_preference.belongsTo(user, { foreignKey: 'user_id', foreignKeyConstraint: true });

export {
  user,
  album_preference
};
