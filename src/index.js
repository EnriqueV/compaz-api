require('dotenv').config();
const express = require('express');
const cors = require('cors');
const youtubeRoutes = require('./routes/youtube.routes');
const imageKitRoutes = require('./routes/imagekit.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/youtube', youtubeRoutes);
app.use('/api/images', imageKitRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});