import user from './user.js';
import album_preference from './album_preference.js';

user.hasMany(album_preference);
album_preference.belongsTo(user);

export {
  user,
  album_preference
};
