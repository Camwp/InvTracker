export function errorHandler(err, req, res, _next) {
    // Zod validation
    if (err?.name === 'ZodError') {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: err.errors } });
    }
    // CastError (bad ObjectId)
    if (err?.name === 'CastError') {
        return res.status(400).json({ error: { code: 'BAD_ID', message: 'Invalid id format' } });
    }
    // Duplicate key
    if (err?.code === 11000) {
        return res.status(409).json({ error: { code: 'DUPLICATE', message: 'Duplicate key', details: err.keyValue } });
    }
    console.error(err);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Unexpected error' } });
}
