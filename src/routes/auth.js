import express from 'express';
import passport from 'passport';

const r = express.Router();

r.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

r.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successReturnToOrRedirect: '/',
}));

r.get('/me', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        const { id, email, name, avatarUrl, role } = req.user;
        return res.json({ authenticated: true, user: { id, email, name, avatarUrl, role } });
    }
    res.json({ authenticated: false, user: null });
});

r.post('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session?.destroy(() => res.status(204).end());
    });
});

r.get('/failure', (_req, res) => res.status(401).json({ error: { code: 'OAUTH_FAILED', message: 'Login failed' } }));

export default r;
