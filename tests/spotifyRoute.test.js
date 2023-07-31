const supertest = require('supertest');
const app = require('../app').default;
const api = supertest(app);
const { sequelize } = require('../services/db');
const { getClientAuthToken } = require('./testUtils');

let clientToken = '';

beforeAll(async () => {
  clientToken = await getClientAuthToken();
  clientToken = 'Bearer ' + clientToken;
});

describe('search tests', () => {
  test('fails without auth header', async () => {
    await api
      .get('/api/spotify/search')
      .expect(401);
  });

  test('fails with malformatted auth header', async () => {
    await api
      .get('/api/spotify/search')
      .set({ authorization: clientToken.slice(7,) })
      .expect(401);
  });

  test('fails with invalid token', async () => {
    await api
      .get('/api/spotify/search')
      .set({ authorization: clientToken + 'z' })
      .expect(400);
  });

  test('fails with empty query', async () => {
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

// TODO: Find a way to login with Spotify so playback can be tested
describe('play tests', () => {
  test('fails without auth header', async () => {
    await api
      .get('/api/spotify/play')
      .expect(401);
  });

  test('fails with malformatted auth header', async () => {
    await api
      .get('/api/spotify/play')
      .set({ authorization: clientToken.slice(7,) })
      .expect(401);
  });

  test('fails with invalid token', async () => {
    await api
      .get('/api/spotify/play')
      .set({ authorization: clientToken })
      .expect(401);
  });
});

// TODO: Find a way to login with Spotify so playback can be tested
describe('queue tests', () => {
  test('fails without auth header', async () => {
    await api
      .get('/api/spotify/queue')
      .expect(401);
  });

  test('fails with malformatted auth header', async () => {
    await api
      .get('/api/spotify/queue')
      .set({ authorization: clientToken.slice(7,) })
      .expect(401);
  });

  test('fails with invalid token', async () => {
    await api
      .get('/api/spotify/queue')
      .set({ authorization: clientToken })
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