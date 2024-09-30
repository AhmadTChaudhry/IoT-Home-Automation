const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/', dashboardRoutes);

//Socket communication of real-time notification
let http = require('http').createServer(app);
let io = require('socket.io') (http);

io.on('connection', (socket) => {
    console.log('New client connected:');

    // Sending real-time notifications
    socket.on('deviceAction', (actionData) => {
        console.log('Device action received:', actionData);

        io.emit('newNotification', {
            message: `Device ${actionData.device} has been turned ${actionData.status ? "ON" : "OFF"}`,
            time: new Date().toLocaleTimeString()
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
