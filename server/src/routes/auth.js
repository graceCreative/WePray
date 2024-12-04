const router = require('express').Router();
const passport = require('passport');
const { generateToken } = require('../config/jwt');
const { validate, check } = require('../middleware/validate');
const AuthController = require('../controllers/authController');

const authValidations = {
   register: [
       check('email').isEmail().withMessage('Valid email is required'),
       check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
       check('name').notEmpty().withMessage('Name is required')
   ],
   login: [
       check('email').isEmail().withMessage('Valid email is required'),
       check('password').notEmpty().withMessage('Password is required')
   ]
};

// Regular auth routes
router.post('/register', validate(authValidations.register), AuthController.register);
router.post('/login', validate(authValidations.login), AuthController.login);
router.get('/logout', AuthController.logout);

// Google OAuth routes
router.get('/google', 
   passport.authenticate('google', { 
       scope: ['profile', 'email']
   })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login/gfail' }),
    AuthController.googleCallback
);

// Get current user
router.get('/me', 
   
    passport.authenticate('jwt', { session: false }),
   (req, res) => {
       res.json({ 
           success: true, 
           data: req.user 
       });
   }
   
);

module.exports = router;