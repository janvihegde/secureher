require('dotenv').config();
const express = require('express');
const cors = require('cors');
// ONLY ONE declaration of connectDB here:
const connectDB = require('./config/db.js');

const app = express();

// Call the function you imported
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SecureHer API is running...');
});

// Import and Use Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alert', require('./routes/alertRoutes')); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});