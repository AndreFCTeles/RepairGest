// importação de frameworks
const express = require('express'); // framework essencial para API
const cors = require('cors'); // framework de busca de dados
const fs = require('fs').promises; // framework para sistema de ficheiros
const path = require('path'); // libraria para filesystem

// configuração do servidor
const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'files');

// Objeto temporário para cache
let cache = {};

// Inicialização
app.use(express.json());
/*
const corsOptions = {
   origin: `http://localhost:1420`, // Replace with your front-end's actual origin
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
};
app.use(cors(corsOptions));
*/
app.use(cors());

// Carregar dados JSON a partir de um ficheiro
app.use('/files', express.static(dataFilePath)); // Servir ficheiros estáticos a partir de caminho

// Ler ficheiro JSON
const readJsonFile = async (fileName) => {
   try {
      const filePath = path.join(dataFilePath, fileName);
      const jsonData = await fs.readFile(filePath, 'utf-8');
      const parsedJsonData = JSON.parse(jsonData);
      //console.log('Amostra de dados:', parsedJsonData[0]);
      return parsedJsonData;
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
      const fileName = req.query.fileName || 'tblRepairList.json'; // Busca ficheiro
      const cacheKey = `${fileName}-sorted`; // Prepara cache
      let sortedData; // Prepara variável para guardar dados organizados

      // Verificar se existe o ficheiro organizado em cache
      if (cache[cacheKey]) { // usa os dados existentes
         sortedData = cache[cacheKey];
      } else { // ordenar dados   
         // Ordenar dados pela data - mais recente primeiro
         const jsonData = await readJsonFile(fileName); // Prepara dados do ficheiro
         const dataCopy = JSON.parse(JSON.stringify(jsonData)); // Deep copy para não alterar jsonData

         if (!Array.isArray(dataCopy)) { // Verificar erros de estrutura de dados
            throw new Error('Data is not in expected array format');
         }
         if (!dataCopy.every(item => item.DataTime && item.DataTime['$date'])) { // Verificar erros de consistência de formatos
            throw new Error('Formato de data inconsistente');
         }
         const isDataValid = jsonData.every(item => item.DataTime && typeof item.DataTime['$date'] === 'string');
         console.log('Is data valid:', isDataValid);

         console.log('First item structure:', jsonData[0]);
         console.log('Antes de ordenar[0]:', dataCopy[0].DataTime['$date'], dataCopy[1].DataTime['$date']);
         console.log('Antes de ordenar[last]:', dataCopy[dataCopy.length - 1].DataTime['$date'], dataCopy[dataCopy.length - 2].DataTime['$date']);
         sortedData = dataCopy.sort((a, b) => {
            // ordenar e tratar dados em falta ou mal formados
            const dateA = a.DataTime && a.DataTime['$date'] ? new Date(a.DataTime['$date']) : new Date(0);
            const dateB = b.DataTime && b.DataTime['$date'] ? new Date(b.DataTime['$date']) : new Date(0);
            console.log('Parsed Date:', new Date(jsonData[0].DataTime['$date']));
            return dateA - dateB;
         });
         console.log('Depois de ordenar[0]:', sortedData[0].DataTime['$date'], sortedData[1].DataTime['$date']);
         console.log('Depois de ordenar[last]:', sortedData[sortedData.length - 1].DataTime['$date'], sortedData[sortedData.length - 2].DataTime['$date']);
         cache[cacheKey] = sortedData;
      }

      // Declarar paginação pretendida
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 30;
      // Contagem de items/páginas
      const totalItems = sortedData.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      // Calcular inicio e fim baseado em parâmetros de paginação
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      // Fetch, retornar subset consoante paginação
      const paginatedData = sortedData.slice(startIndex, endIndex);
      // Prepara cache de dados paginados
      const paginatedCacheKey = `${cacheKey}-page${page}-size${pageSize}`;
      // Guarda dados paginados em cache
      if (!cache[paginatedCacheKey]) {
         cache[paginatedCacheKey] = { data: paginatedData, totalItems, totalPages, pageSize };
      }
      // Caso seja pedida paginação
      if (req.query.page || req.query.pageSize) {
         return res.json(cache[paginatedCacheKey]); // Retorna dados paginados
      } else {
         return res.json({ data: sortedData, totalCount: totalItems }); // Retorna todos os dados
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

      const filePath = path.join(dataFilePath, fileName);
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

      res.status(201).json({ success: true, data: newRepar });
   } catch (error) {
      handleError(res, error, 'Erro ao escrever dados');
   }
});

// API endpoint para login
app.post('/api/login', async (req, res) => {
   try {
      const { user, password } = req.body;
      const jsonData = await readJsonFile('login.json');
      const userMatch = jsonData.reparacoes.find((u) => u.user === user && u.password === password);

      if (userMatch) {
         res.json({ success: true, user: userMatch });
      } else {
         res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
   } catch (error) {
      handleError(res, error, 'Erro durante autenticação');
   }
});


// Start
app.listen(port, () => { console.log(`Servidor a correr em http://localhost:${port}`); });