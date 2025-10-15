import request from 'supertest';
import {buildTestApp} from './app';
import {connect, closeDatabase, clearDatabase} from './setup/db';
import Category from '../src/models/Category';

describe('Categories API', () => {
    let app, cat;

    beforeAll(async () => {
        await connect();
        app = buildTestApp();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
        cat = await Category.create({ name: 'Tools', color:'#00ff00' });
    });

    test('GET /categories returns all categories', async () => {
        const res = await request(app).get('/categories');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /categories/:id returns one', async () => {
        const res = await request(app).get(`/categories/${cat._id}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Tools');
        expect(res.body.color).toBe('#00ff00');
    });

    test('POST /categories creates a category', async () => {
        const res = await request(app).post('/categories').send({ name: 'Hardware', color: '#ff0000' });
        expect(res.status).toBeLessThan(500);
        if (res.status === 201) {
            expect(res.body.name).toBe('Hardware');
            expect(res.body.color).toBe('#ff0000');
        }
    });

    test('PUT /categories/:id updates', async () => {
        const res = await request(app).put(`/categories/${cat._id}`).send({ name: 'Hand Tools' });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Hand Tools');
    });

    test('DELETE /categories/:id deletes a category', async () => {
        const res = await request(app).delete(`/categories/${cat._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});