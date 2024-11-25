const { Router } = require('express');
const router = Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const prayerRoutes = require('./prayers');
const eventRoutes = require('./events');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/prayers', prayerRoutes);
router.use('/events', eventRoutes);

module.exports = router;