const supertest = require('supertest');
const app = require('../app').default;
const { deleteUser } = require('../services/trackPreferencesService');
const api = supertest(app);
const {
  getClientAuthToken,
  clearTestDatabase
} = require('./testUtils');
const { findUser, findOrCreateUser } = require('../services/trackPreferencesService.js');
const { sequelize } = require('../services/db');

let clientToken = '';

beforeAll(async () => {
  clientToken = await getClientAuthToken();
  clientToken = 'Bearer ' + clientToken;
  await clearTestDatabase();
});

// TODO: Find a way to login with Spotify so Spotify auth can be tested
describe('preference route tests', () => {
  test('fails with invalid token', async () => {
    await api
      .get('/api/trackPreferences')
      .set({ authorization: clientToken })
      .expect(401);
  });

  test('fails with no token', async () => {
    await api
      .get('/api/trackPreferences')
      .expect(403);
  });

  test('fails with malformatted token', async () => {
    await api
      .get('/api/trackPreferences')
      .set({ authorization: clientToken.slice(7,) })
      .expect(403);
  });
});

describe('user service tests', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  test('find user that does exist', async () => {
    await findOrCreateUser('1', 'test_user');
    const newUserQuery = await findUser('1');
    expect(newUserQuery.display_name).toBe('test_user');
    expect(newUserQuery.spotify_id).toBe('1');
  });

  test('fail to find user that does not exist', async () => {
    await findOrCreateUser('1', 'test_user');
    const newUserQuery = await findUser('5');
    expect(newUserQuery).toBe(null);
  });

  test('fail to find user with no id specified', async () => {
    const user = await findUser();
    expect(user).toBe(null);

    const user2 = await findUser('');
    expect(user2).toBe(null);
  });

  test('fail to find/create user with no id specified', async () => {
    const user = await findOrCreateUser();
    expect(user).toBe(null);

    const user2 = await findOrCreateUser('');
    expect(user2).toBe(null);
  });

  test('delete user that does not exist', async () => {
    await deleteUser(999999);
  });

  test('delete user that does exist', async () => {
    const newUser = await findOrCreateUser('1', 'test_user');
    const newUserQuery = await findUser('1');
    expect(newUserQuery.display_name).toBe('test_user');
    expect(newUserQuery.spotify_id).toBe('1');

    await deleteUser(newUser.id);
    const user = await findUser('1');
    expect(user).toBe(null);
  });

  test('delete fails with invalid id', async () => {
    const response = await deleteUser(-10000);
    expect(response).toBe(-1);
  });
});

// describe('album preference service tests', () => {
//   beforeEach(async () => {
//     await clearTestDatabase();
//     await findOrCreateUser('1', 'test_user');
//     const newUserQuery = await findUser('1');
//     expect(newUserQuery.display_name).toBe('test_user');
//   });

// });

afterAll(async () => {
  try{
    await sequelize.close();
  }
  catch(error) {
    console.log(error);
  }
});
