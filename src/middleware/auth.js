export function requireAuth(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Login required' } });
}

export function requireAdmin(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated() && req.user?.role === 'admin') return next();
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Admin only' } });
}
