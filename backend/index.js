const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const MONGO_URI = 'mongodb://localhost:27017/LawPalDB';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// --- Main API Endpoint to Query the AI ---
app.post('/api/query', async (req, res) => {
  const { query } = req.body;
  
  // This now has your live ngrok URL
  const colabApiUrl = 'https://c00000470686.ngrok-free.app/query'; 
  
  if (!query) {
    return res.status(400).json({ error: 'Query not provided' });
  }

  try {
    console.log(`Forwarding query to Colab: "${query}"`);
    
    // Send the query to the AI model running on Colab
    const response = await axios.post(colabApiUrl, { query });
    
    console.log('Received response from Colab.');
    res.json(response.data);

  } catch (error) {
    console.error('Error calling Colab API:', error.message);
    res.status(500).json({ error: 'Failed to get response from AI model. Is the Colab server running?' });
  }
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Backend server is listening at http://localhost:${port}`);
});