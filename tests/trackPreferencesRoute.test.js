const supertest = require('supertest');
const app = require('../app').default;
const { deleteUser } = require('../services/trackPreferencesService');
const api = supertest(app);
const {
  getClientAuthToken,
  clearTestDatabase,
  addUser,
  getUser
} = require('./testUtils');
const { sequelize } = require('../services/db');

let clientToken = '';

beforeAll(async () => {
  clientToken = await getClientAuthToken();
  clientToken = 'Bearer ' + clientToken;
  await clearTestDatabase();
});

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

// describe('find user service tests', () => {

// });

describe('delete service tests', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  test('delete user that does not exist', async () => {
    await deleteUser(999999);
  });

  test('delete user that does exist', async () => {
    const newUser = await addUser('1', 'test_user');
    const newUserQuery = await getUser('1', 'test_user');
    expect(newUserQuery.display_name).toBe('test_user');
    expect(newUserQuery.spotify_id).toBe('1');

    await deleteUser(newUser.id);
    const user = await getUser('1', 'test_user');
    expect(user).toBe(null);
  });

  test('delete fails with invalid id', async () => {
    const response = await deleteUser(-10000);
    expect(response).toBe(-1);
  });
});

afterAll(async () => {
  try{
    await sequelize.close();
  }
  catch(error) {
    console.log(error);
  }
});
