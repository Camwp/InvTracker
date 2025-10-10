import request from 'supertest';
import { buildTestApp } from './app.js';
import { connect, closeDatabase, clearDatabase } from './setup/db.js';
import Location from '../src/models/Location.js';

describe('Locations', () => {
  let app, loc;

  beforeAll(async () => { await connect(); app = buildTestApp(); });
  afterAll(async () => { await closeDatabase(); });
  beforeEach(async () => { await clearDatabase(); });

  test('POST /locations creates (requires code)', async () => {
    const res = await request(app).post('/locations').send({ name: 'Main', code: 'MAIN' });
    expect(res.status).toBe(201);
    expect(res.body.code).toBe('MAIN');
  });

  test('GET/PUT/DELETE in one go', async () => {
    loc = await Location.create({ name: 'A1', code: 'A1' });

    const g = await request(app).get(`/locations/${loc._id}`);
    expect(g.status).toBe(200);

    const u = await request(app).put(`/locations/${loc._id}`).send({ name: 'A1 Updated' });
    expect(u.status).toBe(200);
    expect(u.body.name).toBe('A1 Updated');

    const d = await request(app).delete(`/locations/${loc._id}`);
    expect(d.status).toBe(204);
  });
});