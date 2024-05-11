const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/critique_corner', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define feedback schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: String,
  rating: Number,
  category: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// API endpoint to handle form submission
app.post('/submit-feedback', express.json(), (req, res) => {
  const { name, email, feedback, rating, category } = req.body;
  console.log('Received feedback data:', req.body);

  // Create a new feedback document
  const newFeedback = new Feedback({
    name,
    email,
    feedback,
    rating,
    category
  });

  // Save the feedback document to the database
  newFeedback.save()
    .then(() => {
      console.log('Feedback submitted successfully');
      res.json({ success: true });
    })
    .catch(err => {
      console.error('Error submitting feedback:', err);
      res.status(500).json({ error: 'An error occurred while submitting feedback' });
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:5000`);
});
