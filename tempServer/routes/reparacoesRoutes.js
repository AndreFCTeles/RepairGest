const express = require('express');
const router = express.Router();
const Repair = require('../models/repairModel');

// Create endpoint to handle data creation
router.post('/create', async (req, res) => {
   try {
      const newRepair = await Repair.create(req.body);
      res.json(newRepair);
   } catch (error) {
      console.error('Erro a criar nova reparação:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// Create endpoint to handle data retrieval
router.get('/retrieve', async (req, res) => {
   try {
      const repairs = await Repair.find();
      res.json(repairs);
   } catch (error) {
      console.error('Erro a retornar reparações:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

module.exports = router;
