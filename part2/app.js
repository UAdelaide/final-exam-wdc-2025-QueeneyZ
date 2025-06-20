const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(session({
    secret: 'mydogsecret',
    resave: false,
    saveUninitialized: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/', userRoutes);

// Export the app instead of listening here
module.exports = app;