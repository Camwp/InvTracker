import request from 'supertest';
import { buildTestApp } from './app.js';
import { connect, closeDatabase, clearDatabase } from './setup/db.js';
import Category from '../src/models/Category.js';
import Location from '../src/models/Location.js';
import Item from '../src/models/Item.js';

describe('Items API', () => {
    let app;
    let cat;
    let loc;

    beforeAll(async () => {
        await connect();
        app = buildTestApp();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
        cat = await Category.create({ name: 'Widgets' });
        loc = await Location.create({ name: 'Main Warehouse', code: 'MAIN', address: '123 St' });
    });

    test('POST /items creates an item', async () => {
        const payload = {
            name: 'Bolt',
            sku: 'B-001',
            categoryId: cat._id.toString(),
            locationId: loc._id.toString(),
            qtyOnHand: 10,
            unit: 'ea',
            unitCost: 0.25,
            reorderLevel: 5,
            status: 'active'
        };

        const res = await request(app).post('/items').send(payload);
        expect(res.status).toBe(201);
        expect(res.body._id).toBeDefined();
        expect(res.body.name).toBe('Bolt');

        const inDb = await Item.findById(res.body._id);
        expect(inDb).not.toBeNull();
        expect(inDb.qtyOnHand).toBe(10);
    });

    test('PUT /items/:id updates an item', async () => {
        const item = await Item.create({
            name: 'Nut', sku: 'N-001', categoryId: cat._id, locationId: loc._id,
            qtyOnHand: 3, unit: 'ea', unitCost: 0.15, reorderLevel: 2, status: 'active'
        });

        const res = await request(app).put(`/items/${item._id}`).send({ qtyOnHand: 8 });
        expect(res.status).toBe(200);
        expect(res.body.qtyOnHand).toBe(8);
    });

    test('DELETE /items/:id deletes an item', async () => {
        const item = await Item.create({
            name: 'Screw', sku: 'S-001', categoryId: cat._id, locationId: loc._id,
            qtyOnHand: 30, unit: 'ea', unitCost: 0.05, reorderLevel: 10, status: 'active'
        });

        const res = await request(app).delete(`/items/${item._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);

        const check = await Item.findById(item._id);
        expect(check).toBeNull();
    });
})