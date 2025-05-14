const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const User = require('./models/User');
const axios = require('axios');
const cors = require('cors');

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// In-memory users database (for simplicity)
let score = 0;
let currentGame = null;

// Connect to MongoDB
const mongoURI = 'mongodb+srv://steadyshopper1:caqwJ7digavTCPb9@cluster0.t734z.mongodb.net/BananaGameDB?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send({ message: 'Registration failed due to server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    res.status(200).send({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: 'Login failed due to server error' });
  }
});

// Reset password endpoint
app.post('/reset-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send({ message: 'Error resetting password' });
  }
});

// Endpoint to get a random game
app.get('/nextGame', async (req, res) => {
  try {
    const tomatoapi = "https://marcconrad.com/uob/banana/api.php?out=csv&base64=yes";

    const response = await axios.get(tomatoapi);
    const dataraw = response.data.split(',');

    const base64Image = dataraw[0]; // Base64-encoded image
    const solution = parseInt(dataraw[1], 10); // Solution of the game

    // Add MIME type to the base64 string for proper rendering in React
    const formattedImage = `data:image/png;base64,${base64Image}`; 

    console.log("Formatted Image Data:", formattedImage);

    // Return the game image and solution to the frontend
    res.status(200).json({ gameImage: formattedImage, solution: solution });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).send({ message: 'Failed to fetch the game.' });
  }
});

// Endpoint to check the solution
app.post('/checkSolution', (req, res) => {
  const { answer } = req.body;

  if (currentGame && answer === currentGame.solution) {
    score++; // Increase score if the answer is correct
    res.status(200).send({ correct: true, score });
  } else {
    res.status(200).send({ correct: false, score });
  }
});

// Endpoint to get the current score
app.get('/score', (req, res) => {
  res.status(200).send({ score });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
