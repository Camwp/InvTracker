import request from 'supertest';
import { buildTestApp } from './app.js';

describe('Health', () => {
  test('GET /health returns ok:true', async () => {
    const res = await request(buildTestApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});