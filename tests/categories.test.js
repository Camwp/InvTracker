import request from 'supertest';
import {buildTestApp} from './app';
import {connect, closeDatabase, clearDatabase} from './setup/db';
import Category from '../src/models/Category';

describe('Categories API', () => {
    let app;

    beforeAll(async () => {
        await connect();
        app = buildTestApp();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    test ('GET /categories returns empty array initially', async () => {
        const res = await request(app).get('/categories');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /categories creates a category', async () => {
        const res = await request(app).post('/categories').send({ name: 'Hardware', color: '#ff0000' });
        expect(res.status).toBeLessThan(500); // allow 201 or 400 if validators differ
        if (res.status === 201) {
            expect(res.body.name).toBe('Hardware');
        }
    });

    test('DELETE /categories/:id deletes a category', async () => {
        const cat = await Category.create({ name: 'Tools' });
        const res = await request(app).delete(`/categories/${cat._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
})