const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT;
// const PORT = process.env.PORT || 6000;

// MongoDB connection
dotenv.config();
connectDB();

// User schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Registration failed');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, 'secret_key');

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Login failed');
  }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send('Token not provided');
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }

    req.username = decoded.username;
    next();
  });
}

// Feedback endpoint
app.post('/submit-feedback', verifyToken, (req, res) => {
  try {
    const { feedback_for, category, name, email, brand_name, feedback, rating } = req.body;

    // Save feedback to the database
    // Example: create Feedback model and save feedback data

    res.status(200).send('Feedback submitted successfully');
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).send('Feedback submission failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`.yellow.bold)
  );

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://127.0.0.1:5500/critique-corner/public/login.html",
      // credentials: true,
    },
  });

// Register endpoint
app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({ username, password: hashedPassword });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).send('User registered successfully');
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Registration failed');
    }
  });
  
  // Login endpoint
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
      }
  
      // Generate JWT token
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Login failed');
    }
  });
  
  // Feedback endpoint
  app.post('/submit-feedback', verifyToken, (req, res) => {
    try {
      const { feedback_for, category, name, email, brand_name, feedback, rating } = req.body;
  
      // Save feedback to the database
      // Example: create Feedback model and save feedback data
  
      res.status(200).send('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).send('Feedback submission failed');
    }
  });
  