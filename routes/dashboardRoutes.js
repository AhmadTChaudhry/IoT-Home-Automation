const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route for the home dashboard
router.get('/', dashboardController.getHomePage);

router.get('/2', dashboardController.getHomePage2);

module.exports = router;
