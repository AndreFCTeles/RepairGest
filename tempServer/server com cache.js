/* |----- INICIALIZAÇÃO DO SERVIDOR -----| */

// importação de frameworks
const express = require('express'); // --------------- Framework essencial para API
const cors = require('cors'); // --------------------- Framework de busca de dados
const fs = require('fs').promises; // ---------------- Framework para sistema de ficheiros
const path = require('path'); // --------------------- Libraria para filesystem

// configuração do servidor
const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'files');

// Objeto temporário para cache
let cache = {};

// Inicialização de frameworks
app.use(express.json());  // ------------------------- Funcionalidades básicas Express para funcionalidades do servidor
app.use(cors()); // ---------------------------------- CORS básico para cross-referencing de origens cliente-servidor
app.use('/files', express.static(dataFilePath)); // -- Servir ficheiros JSON estáticos a partir de caminho





/* |----- FUNÇÕES PARA FUNCIONALIDADES DO SERVIDOR -----| */

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

// Comparar dois valores para sorting
const compareFunction = (a, b) => {
   const dateA = new Date(a.DataTime || 0);
   const dateB = new Date(b.DataTime || 0);
   return dateB - dateA;
}

// Algoritmo QuickSort
function quickSort(arr, compareFunction) { // -------- Essencialmente uma busca binária para sorting
   if (arr.length < 2) return arr;
   let pivot = arr[Math.floor(Math.random() * arr.length)];
   let left = [], right = [], equal = [];
   for (let element of arr) {
      const comparison = compareFunction(element, pivot);
      if (comparison < 0) left.push(element);
      else if (comparison > 0) right.push(element);
      else equal.push(element);
   }
   return [...quickSort(left, compareFunction), ...equal, ...quickSort(right, compareFunction)];
}





/* |----- ENDPOINTS DA API -----| */

// API endpoint para buscar dados JSON
app.get('/api/data', async (req, res) => {
   try {
      const fileName = req.query.fileName || 'tblRepairList.json'; // --------------------------------------- Busca ficheiro
      const cacheKey = `${fileName}-sorted`; // ------------------------------------------------------------- Prepara cache

      if (!cache[cacheKey]) { // ---------------------------------------------------------------------------- Verificar se existe o ficheiro organizado em cache
         const jsonData = await readJsonFile(fileName); // -------------------------------------------------- Prepara dados do ficheiro
         const dataCopy = JSON.parse(JSON.stringify(jsonData)); // ------------------------------------------ Deep copy para não alterar jsonData
         if (!Array.isArray(dataCopy)) { throw new Error('Dados num formato inesperado - Servidor'); } // --- Verificar erros de estrutura de dados
         cache[cacheKey] = quickSort(dataCopy, compareFunction); // ----------------------------------------- Ordenar dados por data e guardar em cache
      }

      // Declarar paginação pretendida
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 30;

      // Contagem de items/páginas
      const totalItems = cache[cacheKey].length;
      const totalPages = Math.ceil(totalItems / pageSize);

      // Calcular inicio e fim baseado em parâmetros de paginação
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      // Fetch, retornar subset consoante paginação
      const paginatedData = cache[cacheKey].slice(startIndex, endIndex);

      // Retornar dados
      res.json({ data: paginatedData, totalItems, totalPages, currentPage: page });
   } catch (error) {
      handleError(res, error, 400, 'Erro ao buscar dados - Servidor');
   }
});

// API endpoint para escrever dados - WIP
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
      handleError(res, error, 'Erro ao escrever dados - Servidor');
   }
});

// API endpoint para login - WIP
app.post('/api/login', async (req, res) => {
   try {
      const { user, password } = req.body;
      const jsonData = await readJsonFile('login.json');
      const userMatch = jsonData.reparacoes.find((u) => u.user === user && u.password === password);

      if (userMatch) {
         res.json({ success: true, user: userMatch });
      } else {
         res.status(401).json({ success: false, message: 'Credenciais inválidas - Servidor' });
      }
   } catch (error) {
      handleError(res, error, 'Erro durante autenticação - Servidor');
   }
});





/* |----- CORRER SERVIDOR -----| */

app.listen(port, () => { console.log(`Servidor a correr em http://localhost:${port}`); });