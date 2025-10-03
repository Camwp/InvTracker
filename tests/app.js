import express from 'express';
import itemsRouter from '../src/routes/items.js';
import categoriesRouter from '../src/routes/categories.js';
import locationsRouter from '../src/routes/locations.js';
import notesRouter from '../src/routes/notes.js';
import usersRouter from '../src/routes/users.js';

function mockAuth(req, res, next) {
    req.isAuthenticated = () => true;
    req.user = {id: 'test-user', role: 'admin'};
    next();
}

export function buildTestApp() {
    const app = express();
    app.use(express.json());
    app.use(mockAuth);
    app.use('/items', itemsRouter);
    app.use('/categories', categoriesRouter);
    app.use('/locations', locationsRouter);
    app.use('/notes', notesRouter);
    app.use('/users', usersRouter);
    return app;
}