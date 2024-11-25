const passport = require('passport');
const pool = require('../config/database');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/UserModel');
const { generateToken, verifyToken } = require('./jwt');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

// Serialize user instance into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user instance from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth 2.0 Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/api/auth/google/callback", // Update for production
            scope: ['profile', 'email'], // Request user's profile and email
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                if (!profile.emails || !profile.emails[0].value) {
                    console.error('No email found in profile');
                    return done(null, false, { message: 'No email provided by Google' });
                }

                const email = profile.emails[0].value;
                console.log('Google Profile:', profile);

                let user = await UserModel.findByEmail(email);

                if (!user) {
                    user = await UserModel.create({
                        name: profile.displayName,
                        email: email,
                        google_id: profile.id,
                        role: 'member',
                        status: 'active',
                    });
                    console.log('Created new user:', user);
                } else if (!user.google_id) {
                    console.log('User exists but no Google ID');
                    await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [profile.id, user.id]);
                    user.google_id = profile.id;
                }

                console.log('Successfully authenticated user:', user);

                const token = generateToken({ id: user.id, email: user.email });
                user.token = token;

                return done(null, user);
            } catch (error) {
                console.error('Google login error:', error);
                return done(error, null);
            }
        }
    )
);

// JWT Strategy Configuration
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
            secretOrKey: process.env.JWT_SECRET, 
        },
        async (jwtPayload, done) => {
            try {
                // Verify token payload and find user
                const user = await UserModel.findById(jwtPayload.id);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'User not found' });
                }
            } catch (error) {
                console.error('JWT authentication error:', error);
                return done(error, false);
            }
        }
    )
);

module.exports = passport;
