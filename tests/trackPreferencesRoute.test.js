const supertest = require('supertest');
const app = require('../app').default;
const { deleteUser } = require('../services/trackPreferencesService');
const api = supertest(app);
const { sequelize, connectToDatabase } = require('../services/db');
const { getClientAuthToken } = require('./testUtils');

let clientToken = '';

beforeAll(async () => {
  clientToken = await getClientAuthToken();
  clientToken = 'Bearer ' + clientToken;
  await connectToDatabase();
});

describe('preference route tests', () => {
  test('fails with invalid token', async () => {
    await api
      .get('/api/trackPreferences')
      .set({ authorization: clientToken })
      .expect(401);
  });
});

describe('delete service tests', () => {
  test('delete user that does not exist', async () => {
    await deleteUser(999999);
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