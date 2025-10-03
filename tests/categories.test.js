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
    })
})