import request from 'supertest';
import { buildTestApp } from './app.js';
import { connect, closeDatabase, clearDatabase } from './setup/db.js';
import Category from '../src/models/Category.js';
import Location from '../src/models/Location.js';
import Item from '../src/models/Item.js';
import User from '../src/models/User.js';
import Note from '../src/models/Note.js';

describe('Notes CRUD', () => {
  let app;
  let author;
  let item;
  let createdNote;

  beforeAll(async () => {
    await connect();
    app = buildTestApp();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    const cat = await Category.create({ name: 'Hardware' });
    const loc = await Location.create({ name: 'Aisle 1', code: 'A1' });

    item = await Item.create({
      name: 'Bolt',
      sku: 'B-001',
      categoryId: cat._id,
      locationId: loc._id,
      qtyOnHand: 10,
      unit: 'ea',
      unitCost: 0.1,
      reorderLevel: 2,
      status: 'active',
    });

    author = await User.create({
      firstName: 'Alice',
      lastName: 'Tester',
      email: 'alice@example.com',
      role: 'admin',
    });
  });

  test('POST /notes/:itemId creates a note', async () => {
    const res = await request(app)
      .post(`/notes/${item._id}`)
      .send({ body: 'Check for damage', type: 'general', pinned: true });
    expect([201, 200, 204]).toContain(res.status);
    createdNote = res.body?._id ? res.body : await Note.findOne({ itemId: item._id });
    expect(createdNote).toBeTruthy();
  });

  test('GET /notes returns list (includes newly created)', async () => {
    const seeded = await Note.create({
      itemId: item._id,
      authorId: author._id,
      body: 'Initial audit note',
      type: 'audit',
      pinned: false,
    });
    const res = await request(app).get('/notes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((n) => String(n._id) === String(seeded._id));
    expect(found).toBeTruthy();
  });

  test('GET /notes/:id returns one', async () => {
    const seeded = await Note.create({
      itemId: item._id,
      authorId: author._id,
      body: 'Single fetch',
      type: 'general',
      pinned: false,
    });
    const res = await request(app).get(`/notes/single/${seeded._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(String(seeded._id));
    expect(res.body.body).toBe('Single fetch');
  });

  test('GET /notes/:itemId returns one by item id', async () => {
    await Note.create({
      itemId: item._id,
      authorId: author._id,
      body: 'Initial audit note',
      type: 'audit',
      pinned: false,
    });
    const res = await request(app).get(`/notes/${item._id}`);
    expect(res.status).toBe(200);
  });

  test('PUT /notes/:id updates a note', async () => {
    const seeded = await Note.create({
      itemId: item._id,
      authorId: author._id,
      body: 'Old body',
      type: 'general',
      pinned: false,
    });

    const res = await request(app)
      .put(`/notes/${seeded._id}`)
      .send({ body: 'Updated body', pinned: true });

    expect(res.status).toBe(200);
    expect(res.body.body).toBe('Updated body');
    expect(res.body.pinned).toBe(true);
  });

  test('DELETE /notes/:id removes a note (204 or 200)', async () => {
    const seeded = await Note.create({
      itemId: item._id,
      authorId: author._id,
      body: 'To delete',
      type: 'general',
      pinned: false,
    });

    const res = await request(app).delete(`/notes/${seeded._id}`);
    expect([204, 200]).toContain(res.status);

    const check = await Note.findById(seeded._id);
    expect(check).toBeNull();
  });
});