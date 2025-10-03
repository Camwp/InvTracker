import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import User from './src/models/User.js';
import authRoutes from './src/routes/auth.js';
import categoryRoutes from './src/routes/categories.js';
import locationRoutes from './src/routes/locations.js';
import itemRoutes from './src/routes/items.js';
import noteRoutes from './src/routes/notes.js';
import { requireAuth, requireAdmin } from './src/middleware/auth.js';
import { errorHandler } from './src/middleware/errors.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger.js';

const {
    MONGODB_URI,
    SESSION_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    FRONTEND_ORIGIN,
    PORT = 3000,
} = process.env;

if (!MONGODB_URI || !SESSION_SECRET || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.error('Missing required environment variables.');
    process.exit(1);
}

await mongoose.connect(MONGODB_URI);

// --- Passport session serialization ---
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const u = await User.findById(id).lean();
        done(null, u || null);
    } catch (e) { done(e); }
});

function splitName(displayName) {
    if (!displayName) return { first: 'Google', last: 'User' };
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) return { first: parts[0], last: '' };
    return { first: parts[0], last: parts.slice(1).join(' ') };
}

passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        passReqToCallback: false,
    },
    async (_accessToken, _refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value?.toLowerCase();
            if (!email) return done(new Error('Google did not return an email.'));

            const { first: splitFirst, last: splitLast } = splitName(profile.displayName || '');
            const firstName = profile.name?.givenName ?? splitFirst ?? 'Google';
            const lastName = profile.name?.familyName ?? splitLast ?? 'User';
            const avatarUrl = profile.photos?.[0]?.value;

            const user = await User.findOneAndUpdate(
                { email },
                {
                    $setOnInsert: { email, firstName, lastName, role: 'user', isDeleted: false },
                    $set: { avatarUrl },
                },
                { new: true, upsert: true }
            );

            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }
));

const app = express();

// --- CORS (allow creds; include Authorization for Swagger "Try it out") ---
app.use(cors({
    origin: FRONTEND_ORIGIN || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// --- Sessions ---
const isLocal = !FRONTEND_ORIGIN || FRONTEND_ORIGIN.startsWith('http://localhost');
app.set('trust proxy', 1);
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
    cookie: {
        httpOnly: true,
        sameSite: isLocal ? 'lax' : 'none',
        secure: isLocal ? false : true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// ---------- PUBLIC ROUTES ----------
app.get('/health', (_req, res) => res.json({ ok: true }));

// Swagger UI (PUBLIC)
app.use(
    ['/api-docs', '/docs'],
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            // Let Swagger send cookies for same-origin requests
            requestInterceptor: (req) => { req.credentials = 'include'; return req; },
        },
    })
);

// Auth (PUBLIC)
app.use('/auth', authRoutes);

// Root -> docs (PUBLIC)
app.get('/', (_req, res) => res.redirect('/api-docs'));

// ---------- PROTECTED API ROUTES ----------
app.use('/categories', requireAuth, categoryRoutes);
app.use('/locations', requireAuth, locationRoutes);
app.use('/items', requireAuth, itemRoutes);
app.use('/', requireAuth, noteRoutes); // /items/:itemId/notes and /notes/:id

// Example admin-only routes (if any)
// app.use('/admin', requireAdmin, adminRouter);

// ---------- Errors last ----------
app.use(errorHandler);

// ---------- Start ----------
app.listen(PORT, () => {
    console.log(`API listening on port ${PORT} (frontend: ${FRONTEND_ORIGIN || 'n/a'})`);
});
