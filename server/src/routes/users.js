const router = require('express').Router();
const UserController = require('../controllers/userController');
const { isAuth, isCoordinator, isAdmin } = require('../middleware/auth');
const { validate, check } = require('../middleware/validate');

// Validation middleware
const userValidations = {
    updateStatus: [
        check('status').isIn(['pending', 'active', 'inactive'])
            .withMessage('Invalid status value')
    ],
    updateRole: [
        check('role').isIn(['coordinator', 'moderator', 'member'])
            .withMessage('Invalid role value'),
        check('currentUserRole').custom((value, { req }) => {
            if (value === 'coordinator' && req.body.role === 'admin') {
                throw new Error('Coordinators cannot promote to admin');
            }
            if (value === 'coordinator' && req.params.targetUserRole === 'admin') {
                throw new Error('Coordinators cannot modify admin roles');
            }
            return true;
        })
    ],
    updateProfile: [
        check('name').optional().notEmpty().withMessage('Name cannot be empty'),
        check('email').optional().isEmail().withMessage('Invalid email format'),
        check('password').optional().isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
    ]
};

// Routes
router.get('/profile', isAuth, UserController.getProfile);
router.put('/profile', isAuth, validate(userValidations.updateProfile), UserController.updateProfile);
router.get('/stats', isAuth, isCoordinator, UserController.getStats);

router.get('/members', isAuth, isCoordinator, UserController.getMembers);
router.get('/pending', isAuth, isAdmin, UserController.getPendingMembers);
router.put('/status/:userId', isAuth, isCoordinator, validate(userValidations.updateStatus), UserController.updateStatus);

router.delete('/delete/:userId', isAuth, isAdmin, UserController.delete);
// Modified role update route to allow both admin and coordinator
router.put('/role/:userId', 
    isAuth, 
    (req, res, next) => {
        if (req.user.role === 'admin' || req.user.role === 'coordinator') {
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    },
    validate(userValidations.updateRole), 
    UserController.updateRole
);

router.get('/coordinators', isAuth, isAdmin, UserController.getCoordinators);

module.exports = router;