const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
// const repairRoutes = require('./routes/repairRoutes');
// const mongoose = require('mongoose');
// const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Serve static files from the 'public' directory (adjust the path accordingly)
app.use('/files', express.static(path.join(__dirname, 'files')));

// Load JSON data from file
const jsonData = JSON.parse(fs.readFileSync('files/tblRepairList.json', 'utf8'));

// API endpoint to get JSON data
app.get('/api/data', (req, res) => {
   res.json(jsonData);
});

// Start the server
app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});

/*
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

// Use routes
app.use('/api/repar', reparRoutes);
app.use('/api/cliente', clienteRoutes);
app.use('/api/tudo', tudoRoutes);
*/