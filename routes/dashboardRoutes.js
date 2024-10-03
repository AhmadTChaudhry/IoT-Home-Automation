const express = require('express');
const router = express.Router();
const passport = require('passport');
const dashboardController = require('../controllers/dashboardController');
const { createUser, findUserByEmail } = require('../models/userModel');

// Authentication Middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', dashboardController.getWelcome);

router.get('/register', dashboardController.getRegister);

router.post('/register', (req, res) => {
  const { email, password, password2 } = req.body;

  // Basic validation
  if (!email || !password || !password2) {
    req.flash('error', 'Please fill in all fields.');
    return res.redirect('/register');
  }

  if (password !== password2) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/register');
  }

  // Check if user exists
  findUserByEmail(email, (err, user) => {
    if (err) {
      req.flash('error', 'An error occurred.');
      return res.redirect('/register');
    }
    if (user) {
      req.flash('error', 'Email is already registered.');
      return res.redirect('/register');
    } else {
      // Create new user
      createUser(email, password, (err) => {
        if (err) {
          req.flash('error', 'Error creating user.');
          return res.redirect('/register');
        }
        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/login');
      });
    }
  });
});

router.get('/login', dashboardController.getLogin);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/register',
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/home', ensureAuthenticated, dashboardController.getHomePage);
router.get('/usage', ensureAuthenticated, dashboardController.getUsage);
router.get('/devices', ensureAuthenticated, dashboardController.getDevices);

// Dummy device status and schedules
let deviceStatus = {
  light: false,
  ac: false,
  heater: false,
};

let deviceSchedules = {};

// Toggle device on/off
router.post('/toggle', ensureAuthenticated, (req, res) => {
  const { device, status } = req.body;
  deviceStatus[device] = status;
  res.json({ message: `${device} Turned ${status ? 'ON' : 'OFF'}`, status });
});

// Schedule a device
router.post('/schedule', ensureAuthenticated, (req, res) => {
  const { device, onTime, offTime } = req.body;
  deviceSchedules[device] = { onTime, offTime };
  res.json({
    message: `Schedule set for ${device}`,
    device: device,
    schedule: deviceSchedules[device],
  });
});

// Get current device status
router.get('/status', ensureAuthenticated, (req, res) => {
  res.json({ status: deviceStatus, schedules: deviceSchedules });
});

module.exports = router;
