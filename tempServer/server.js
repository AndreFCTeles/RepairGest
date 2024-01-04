// importação de frameworks
const express = require('express'); // framework essencial para API
const cors = require('cors'); // framework de busca de dados
const fs = require('fs').promises; // framework para sistema de ficheiros
const path = require('path'); // libraria para caminhos de ficheiros

// configuração do servidor
const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'files/tblRepairList.json');

// Inicialização
app.use(express.json());
const corsOptions = {
   origin: `http://localhost:${port}`, // Replace with your front-end's actual origin
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
};
app.use(cors(corsOptions));
// Carregar dados JSON a partir de um ficheiro
app.use('/files', express.static(path.join(__dirname, 'files'))); // Servir ficheiros estáticos a partir de caminho

// Ler ficheiro JSON
const readJsonFile = async (fileName) => {
   try {
      const filePath = path.join(dataFilePath, fileName);
      const jsonData = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(jsonData);
   } catch (error) {
      throw error;
   }
};
// Error handling
const handleError = (res, error, message = 'Erro') => {
   console.error(`${message}: ${error.message}`);
   res.status(500).json({ error: message });
};

// API endpoint para buscar dados JSON
app.get('/api/data', async (req, res) => {
   try {
      const fileName = req.query.fileName || 'tblRepairList.json';
      const jsonData = await readJsonFile(fileName);

      if (req.query.page || req.query.pageSize) { // caso seja pedida paginação
         // Declarar paginação pretendida
         const page = parseInt(req.query.page, 10) || 1;
         const pageSize = parseInt(req.query.pageSize, 10) || 30;
         // Calcular inicio e fim baseado em parâmetros de paginação
         const startIndex = (page - 1) * pageSize;
         const endIndex = startIndex + pageSize;
         // Fetch, retornar subset consoante paginação
         const paginatedData = jsonData.slice(startIndex, endIndex);

         res.json({
            data: paginatedData,
            totalCount: jsonData.length,
            pageSize
         }); // Informação paginada de uma BD e número de items
      } else {
         res.json({ data: jsonData, totalCount: jsonData.length }); // retorna TODA a informação numa BD
      }
   } catch (error) {
      handleError(res, error, 'Erro ao buscar dados');
   }
});

// API endpoint para escrever dados
app.post('/api/data', async (req, res) => {
   try {
      const fileName = req.query.fileName || 'tblRepairList.json';
      const jsonData = await readJsonFile(fileName);

      const newRepar = req.body;

      jsonData.push(newRepar);

      await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8');

      res.status(201).json({ success: true, data: newRepar });
   } catch (error) {
      handleError(res, error, 'Erro ao escrever dados');
   }
});

// Start
app.listen(port, () => { console.log(`servidor a correr em http://localhost:${port}`); });