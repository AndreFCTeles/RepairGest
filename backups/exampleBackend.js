const express = require('express');
const app = express();

// Endpoint to fetch data
app.get('/api/fetchData', (req, res) => {
   // Fetch data from your data source (e.g., database, external API)
   const data = fetchDataFromSource();

   // Send the data as JSON in the response
   res.json(data);
});

// Start the server
const port = 3001;
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
