const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const url = 'db_url';

const apiRoutes = require('./routes/reparacoesRoutes')

MongoClient.connect(url, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}, (err, client) => {
   if (err) throw err;
   const db = client.db('db_name');

   //routes e services
   app.use('/api/data', apiRoutes);

   //Start the server
   app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
   });
}
);