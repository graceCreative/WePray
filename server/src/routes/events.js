const router = require('express').Router();
const EventController = require('../controllers/eventController');
const { isAuth, isCoordinator, isAdmin } = require('../middleware/auth');
const { validate, check } = require('../middleware/validate');

const eventValidations = {
   create: [
       check('title').notEmpty().withMessage('Title is required'),
       check('event_type').isIn(['live_prayer', 'other'])
           .withMessage('Event type must be either live_prayer or other'),
       check('start_time').isISO8601().withMessage('Valid start time is required'),
       check('end_time').isISO8601()
           .withMessage('Valid end time is required')
           .custom((value, { req }) => {
               if (new Date(value) <= new Date(req.body.start_time)) {
                   throw new Error('End time must be after start time');
               }
               return true;
           })
   ],
   update: [
       check('title').optional().notEmpty().withMessage('Title cannot be empty'),
       check('event_type').optional().isIn(['live_prayer', 'other'])
           .withMessage('Invalid event type'),
       check('start_time').optional().isISO8601().withMessage('Invalid start time'),
       check('end_time').optional().isISO8601().withMessage('Invalid end time')
   ]
};

router.post('/', isAuth, ...isCoordinator, validate(eventValidations.create), EventController.create);
router.get('/', isAuth, EventController.getAll);
router.get('/upcoming', isAuth, EventController.getUpcoming);
router.get('/stats', isAuth, isCoordinator, EventController.getStats);
router.get('/:id', isAuth, EventController.getById);
router.put('/:id', isAuth, isCoordinator, validate(eventValidations.update), EventController.update);
router.delete('/:id', isAuth, isAdmin, EventController.delete);

module.exports = router;