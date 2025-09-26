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

// Passport: serialize minimal user info
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const u = await User.findById(id).lean();
        done(null, u || null);
    } catch (e) { done(e); }
});

passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
    },
    async (_req, _accessToken, _refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value?.toLowerCase();
            const name = profile.displayName || profile.name?.givenName || email;
            const avatarUrl = profile.photos?.[0]?.value;

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({ email, name, avatarUrl, role: 'user' });
            } else {
                // keep name/photo fresh
                user.name = name;
                user.avatarUrl = avatarUrl || user.avatarUrl;
                await user.save();
            }
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }
));

const app = express();

// CORS for cross-origin frontends
app.use(cors({
    origin: FRONTEND_ORIGIN, // e.g., https://your-frontend.example
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// Sessions (Mongo-backed)
const isLocal = !process.env.FRONTEND_ORIGIN || process.env.FRONTEND_ORIGIN.startsWith('http://localhost');

app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        httpOnly: true,
        sameSite: isLocal ? 'lax' : 'none',
        secure: isLocal ? false : true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/locations', locationRoutes);
app.use('/items', itemRoutes);
app.use('/', noteRoutes); // provides /items/:itemId/notes and /notes/:id
app.get('/', (req, res) => {
    res.redirect('/api-docs'); // or '/docs' if you prefer
});
// Health & root
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use(errorHandler);

// Start
app.listen(PORT, () => {
    console.log(`API listening on :${PORT}`);
});
