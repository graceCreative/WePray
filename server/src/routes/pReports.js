const router = require('express').Router();
const PrayReportController = require('../controllers/PrayReportController');
const { isAuth, isCoordinator, isAdmin } = require('../middleware/auth');

router.post('/', PrayReportController.create);
router.get('/', isAuth, isAdmin, PrayReportController.getAll);
router.delete('/:id', isAuth, isAdmin, PrayReportController.delete);

module.exports = router;