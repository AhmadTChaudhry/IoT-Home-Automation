const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { stat } = require('fs');

// Route for the home dashboard
router.get('/', dashboardController.getHomePage);

router.get('/usage', dashboardController.getUsage);

router.get('/devices', dashboardController.getDevices);


// Dummy device status and schedules
let deviceStatus = {
    light: false,
    ac: false,
    heater: false
  };
  
  let deviceSchedules = {};
  
  // Toggle device on/off
  router.post('/toggle', (req, res) => {
    const { device, status } = req.body;
    deviceStatus[device] = status;
    res.json({ message: `${device} Turned ${status ?  'ON' : 'OFF'}`, status });
  });
  
  // Schedule a device
  router.post('/schedule', (req, res) => {
    const { device, onTime, offTime } = req.body;
    deviceSchedules[device] = { onTime, offTime };
    res.json({ message: `Schedule set for ${device}`, schedule: deviceSchedules[device] });
  });
  
  // Get current device status
  router.get('/status', (req, res) => {
    res.json({ status: deviceStatus, schedules: deviceSchedules });
  });

module.exports = router;
