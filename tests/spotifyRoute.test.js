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

  test('search route fails with malformatted auth header', async () => {
    await api
      .get('/api/spotify/search')
      .set({ authorization: clientToken.slice(7,) })
      .expect(401);
  });

  test('search route fails with invalid auth header', async () => {
    await api
      .get('/api/spotify/search')
      .set({ authorization: clientToken + 'z' })
      .expect(400);
  });

  test('search route fails with empty query', async () => {
    await api
      .get('/api/spotify/search')
      .set({ authorization: clientToken })
      .expect(400);
  });

  test('search for album', async () => {
    await api
      .get('/api/spotify/search?q=nevermind')
      .set({ authorization: clientToken })
      .expect(200);
  });

  test('search for specific album', async () => {
    const response = await api
      .get('/api/spotify/search?q=thriller')
      .set({ authorization: clientToken })
      .expect(200);

    const albumExists = response.body.some(result => {
      return result.name === 'Thriller' && result.artists[0].name === 'Michael Jackson';
    });
    expect(albumExists).toBe(true);
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