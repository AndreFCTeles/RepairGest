// importação de frameworks
const express = require('express'); // framework essencial para API
const cors = require('cors'); // framework de busca de dados
const fs = require('fs'); // framework para sistema de ficheiros
const path = require('path'); // libraria para caminhos de ficheiros

// configuração do servidor
const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'files/tblRepairList.json');


// Inicialização
app.use(express.json());
app.use(cors());
// Carregar dados JSON a partir de um ficheiro
app.use('/files', express.static(path.join(__dirname, 'files'))); // Servir ficheiros estáticos a partir de caminho
const jsonData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// API endpoint para buscar dados JSON
app.get('/api/data', (req, res) => {
   // Declarar paginação pretendida
   const page = parseInt(req.query.page, 10) || 1;
   const pageSize = parseInt(req.query.pageSize, 10) || 10;
   // Calcular inicio e fim baseado em parâmetros de paginação
   const startIndex = (page - 1) * pageSize;
   const endIndex = page * pageSize;
   // Fetch, retornar subset consoante paginação
   const paginatedData = jsonData.slice(startIndex, endIndex);
   res.json({ data: paginatedData, totalCount: jsonData.length }); // Informação paginada de uma BD e número de items
   // res.json(jsonData); // <- retorna TODA a informação numa BD
});
// API endpoint para buscar apenas o número total de dados/items
app.get('/api/total-paginas', (req, res) => {
   res.json({ totalCount: jsonData.length });
});


// API endpoint para escrever dados
app.post('/api/data', async (req, res) => {
   try {
      await fs.writeFile(dataFilePath, JSON.stringify(jsonData, 'utf8'))
      res.status(201).json(newRepar);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao escrever dados' });
   }
});

// Start
app.listen(port, () => { console.log(`servidor a correr em http://localhost:${port}`); });







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