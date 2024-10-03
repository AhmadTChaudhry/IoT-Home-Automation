// app.js
const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser'); // Not needed as Express has built-in body-parser
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const initializePassport = require('./config/passport-config');
const { createUser, findUserByEmail, findUserById } = require('./models/userModel');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
initializePassport(passport);

// Configure session management
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    store: new (require('connect-sqlite3')(session))({ db: 'sessions.db' }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Make flash messages and user object available in all templates
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.user;
  next();
});

// Import routes
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/', dashboardRoutes);

// Socket communication of real-time notification
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('New client connected:');

  // Sending real-time notifications
  socket.on('deviceAction', (actionData) => {
    console.log('Device action received:', actionData);

    io.emit('newNotification', {
      message: `Device ${actionData.device} has been turned ${actionData.status ? 'ON' : 'OFF'}`,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on('scheduleAction', (device, scheduleData) => {
    console.log('Schedule data received:', scheduleData, device);

    io.emit('scheduleNotification', {
      device: device,
      onTime: scheduleData.onTime,
      offTime: scheduleData.offTime,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
