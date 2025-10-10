import express from 'express';
import itemsRouter from '../src/routes/items.js';
import categoriesRouter from '../src/routes/categories.js';
import locationsRouter from '../src/routes/locations.js';
import notesRouter from '../src/routes/notes.js';
import usersRouter from '../src/routes/users.js';
import mongoose from 'mongoose';

function mockAuth(req, res, next) {
    const oid = new mongoose.Types.ObjectId();
    req.isAuthenticated = () => true;
    req.user = { _id: oid, id: String(oid), role: 'admin' };
    next();
}

export function buildTestApp() {
    const app = express();
    app.use(express.json());
    app.use(mockAuth);
    app.use('/items', itemsRouter);
    app.use('/categories', categoriesRouter);
    app.use('/locations', locationsRouter);
    app.use('/', notesRouter);
    app.use('/notes', notesRouter);
    app.use('/users', usersRouter);
    app.get('/health', (_req, res) => res.json({ ok: true }));
    return app;
}