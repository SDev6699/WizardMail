const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');
const labelRoutes = require('./routes/labelRoutes');
const searchRoutes = require('./routes/searchRoutes');
require('./config/passportConfig');

// Connect to MongoDB
mongoose.connect('mongodb+srv://sdarandale0699:ay1MlrxPK7qMY2HF@atlascluster.4gswbsg.mongodb.net/emailClient', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.use(cors({
  origin: 'https://localhost:5173', // Allow requests from this origin
  credentials: true // Allow cookies to be sent with the requests
}));

app.use(express.json());
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/emails', emailRoutes);
app.use('/labels', labelRoutes);
app.use('/search', searchRoutes);

app.get('/checkAuth', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false, user: null });
  }
});

module.exports = app;
