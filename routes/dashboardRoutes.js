const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route for the home dashboard
router.get('/', dashboardController.getHomePage);

router.get('/usage', dashboardController.getUsage);

module.exports = router;
