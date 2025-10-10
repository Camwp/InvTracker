import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';

let callbackBehavior = 'success';

const passportMock = {
  authenticate: (_strategy, options = {}) => (req, res, next) => {
    const path = req.path;

    if (path.endsWith('/google')) {
      return res.redirect(
        302,
        'https://accounts.google.com/o/oauth2/v2/auth?mock=1'
      );
    }

    if (path.endsWith('/google/callback')) {
      if (callbackBehavior === 'success') {
        req.user = { id: 'u1', email: 'a@b.com', name: 'A', role: 'user', avatarUrl: 'http://img' };
        req.isAuthenticated = () => true;
        return res.redirect(302, options.successReturnToOrRedirect ?? '/');
      }
      return res.redirect(302, options.failureRedirect ?? '/auth/failure');
    }

    return next();
  },
};

jest.unstable_mockModule('passport', () => ({ default: passportMock }));

const { default: authRouter } = await import('../src/routes/auth.js');

function buildApp(preMiddleware) {
  const app = express();
  app.use(express.json());
  if (preMiddleware) app.use(preMiddleware);
  app.use('/auth', authRouter);
  return app;
}

describe('Auth routes (Passport + Google)', () => {
  beforeEach(() => {
    callbackBehavior = 'success';
  });

  test('GET /auth/google redirects to provider', async () => {
    const app = buildApp();
    const res = await request(app).get('/auth/google');
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('accounts.google.com');
  });

  test('GET /auth/google/callback success -> 302 to "/"', async () => {
    callbackBehavior = 'success';
    const app = buildApp();
    const res = await request(app).get('/auth/google/callback');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
  });

  test('GET /auth/google/callback failure -> 302 to "/auth/failure"', async () => {
    callbackBehavior = 'failure';
    const app = buildApp();
    const res = await request(app).get('/auth/google/callback');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/auth/failure');
  });

  test('GET /auth/me unauthenticated -> { authenticated:false }', async () => {
    const pre = (req, _res, next) => {
      req.isAuthenticated = () => false;
      next();
    };
    const app = buildApp(pre);
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ authenticated: false, user: null });
  });

  test('GET /auth/me authenticated -> returns user payload', async () => {
    const pre = (req, _res, next) => {
      req.isAuthenticated = () => true;
      req.user = {
        id: 'u123',
        email: 'x@y.com',
        name: 'X Y',
        avatarUrl: 'http://img',
        role: 'admin',
      };
      next();
    };
    const app = buildApp(pre);
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.authenticated).toBe(true);
    expect(res.body.user).toMatchObject({
      id: 'u123',
      email: 'x@y.com',
      name: 'X Y',
      role: 'admin',
    });
  });
});