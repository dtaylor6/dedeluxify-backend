const supertest = require('supertest');
const app = require('../app').default;
const api = supertest(app);
const { sequelize } = require('../utils/db');
const { getClientAuthToken } = require('./testUtils');

let clientToken = '';

beforeAll(async () => {
  clientToken = await getClientAuthToken();
  clientToken = 'Bearer ' + clientToken;
});

describe('search tests', () => {
  test('search route fails without auth header', async () => {
    await api
      .get('/api/spotify/search')
      .expect(401);
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