const supertest = require('supertest');
const app = require('../app').default;
const { deleteUser } = require('../utils/dbMiddleware');
const api = supertest(app);
const { sequelize, connectToDatabase } = require('../utils/db');
const { getClientAuthToken } = require('./testUtils');

let clientToken = '';

beforeAll(async () => {
  clientToken = await getClientAuthToken();
  clientToken = 'Bearer ' + clientToken;
  await connectToDatabase();
});

describe('delete tests', () => {
  test('delete user functionality', async () => {
    await deleteUser(3);
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