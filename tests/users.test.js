import request from 'supertest';
import { buildTestApp } from './app.js';
import { connect, closeDatabase, clearDatabase } from './setup/db.js';
import User from '../src/models/User.js';

describe('Users CRUD', () => {
  let app;
  let user;

  beforeAll(async () => {
    await connect();
    app = buildTestApp();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({
      firstName: 'Bob',
      lastName: 'Builder',
      email: 'bob@example.com',
      role: 'user',
    });
  });

  test('POST /users creates a user (201)', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        firstName: 'Clara',
        lastName: 'Tester',
        email: 'clara@example.com',
        role: 'admin',
      });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.email).toBe('clara@example.com');
  });

  test('GET /users returns list (excludes soft-deleted)', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Should include the seeded user
    const found = res.body.find((u) => u.email === 'bob@example.com');
    expect(found).toBeTruthy();
  });

  test('GET /users/:id returns a single user', async () => {
    const res = await request(app).get(`/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(String(user._id));
    expect(res.body.email).toBe('bob@example.com');
  });

  test('PUT /users/:id updates fields', async () => {
    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ firstName: 'Robert', role: 'admin' });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Robert');
    expect(res.body.role).toBe('admin');
  });

  test('DELETE /users/:id soft-deletes the user', async () => {
    const res = await request(app).delete(`/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/soft-deleted/i);

    const list = await request(app).get('/users');
    const stillThere = list.body.find((u) => u._id === String(user._id));
    expect(stillThere).toBeUndefined();

    const db = await User.findById(user._id).lean();
    expect(db).toBeTruthy();
    expect(db.isDeleted).toBe(true);
  });
});