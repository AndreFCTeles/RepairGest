const { express, Request, Response } = require('express');
const router = express.Router();
const Repar = require('../models/reparacoesModel');

// Create endpoint to handle data creation
router.post('/reparacoes', async (req, res) => {
   try {
      const newRepar = await Repar.create(req.body);
      res.json(newRepar);
   } catch (error) {
      console.error('Erro a criar nova reparação:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// Create endpoint to handle data retrieval
router.get('/reparacoes', async (req, res) => {
   try {
      const repars = await Repar.find();
      res.json(repars);
   } catch (error) {
      console.error('Erro a retornar reparações:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

module.exports = router;
