const supertest = require('supertest');
const app = require('../app').default;
const { deleteUser } = require('../services/trackPreferencesService');
const api = supertest(app);
const {
  getClientAuthToken,
  clearTestDatabase,
  addUser
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
    const user = await addUser('1', 'test_user');
    await deleteUser(user.id);
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
