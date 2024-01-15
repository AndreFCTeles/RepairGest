/* |----- INICIALIZAÇÃO DO SERVIDOR -----| */

// importação de frameworks
const express = require('express'); // ---------------- Framework essencial para API
const cors = require('cors'); // ---------------------- Framework de busca de dados
const fs = require('fs').promises; // ----------------- Framework para sistema de ficheiros
const path = require('path'); // ---------------------- Libraria para filesystem

// configuração do servidor
const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'files');

// Objeto temporário para cache
// let cache = {}; // Cache disabled

// Inicialização de frameworks
app.use(express.json());  // -------------------------- Funcionalidades básicas Express para funcionalidades do servidor
app.use(cors()); // ----------------------------------- CORS básico para cross-referencing de origens cliente-servidor
app.use('/files', express.static(dataFilePath)); // --- Servir ficheiros JSON estáticos a partir de caminho





/* |----- FUNÇÕES PARA FUNCIONALIDADES DO SERVIDOR - Funções "Helper" -----| */

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

// Comparar dois valores para sorting - ordenar por data
const dateCompareFunction = (a, b) => {
   const dateA = new Date(a.DataTime || 0);
   const dateB = new Date(b.DataTime || 0);
   //console.log(`A comparar: ${dateA} e ${dateB}`);
   return dateB - dateA;
}
// Comparar dois valores para sorting - ordenar por string
const stringCompareFunction = (a, b, field) => {
   const strA = a[field] || "";
   const strB = b[field] || "";
   //console.log(`A comparar: ${strA} e ${strB}`);
   if (strA < strB) { return -1; }
   if (strA > strB) { return 1; }
   return 0;
};

// Algoritmo QuickSort - https://pt.wikipedia.org/wiki/Quicksort
function quickSort(arr, field) {
   if (arr.length < 2) return arr; // --------------- arr.length = 1 ou 0, aceitar valor simples em vez de array (=já ordenado)   
   // Determinar tipo de comparação dependendo do tipo de dados recebidos
   const compareFunction = field === 'DataTime' ? dateCompareFunction : stringCompareFunction;
   // Argumentos para funcionamento do algoritmo
   const pivotIndex = Math.floor(arr.length / 2);
   const pivot = arr[pivotIndex];
   const left = [], right = [], equal = [];

   for (let element of arr) {
      const comparison = compareFunction(element, pivot, field);
      if (comparison < 0) left.push(element);
      else if (comparison > 0) right.push(element);
      else equal.push(element);
   }
   const sortedLeft = quickSort(left, field);
   const sortedRight = quickSort(right, field);

   return [...sortedLeft, ...equal, ...sortedRight];
}






// |----------------------------|
// |----- ENDPOINTS DA API -----|
// |----------------------------|


// |----- ENDPOINTS DE BUSCA -----|

// API endpoint para buscar dados de reparações
app.get('/api/getrepar', async (req, res) => {
   try {
      const fileName = req.query.fileName || 'tblRepairList.json'; // ------------------------------------ Busca ficheiro
      // const cacheKey = `${fileName}-sorted`; // ------------------------------------------------------- Prepara cache

      // if (!cache[cacheKey]) { // ---------------------------------------------------------------------- Verificar se existe o ficheiro organizado em cache
      const jsonData = await readJsonFile(fileName); // -------------------------------------------------- Prepara dados do ficheiro
      const dataCopy = JSON.parse(JSON.stringify(jsonData)); // ------------------------------------------ Deep copy para não alterar jsonData
      if (!Array.isArray(dataCopy)) { throw new Error('Dados num formato inesperado - Servidor'); } // --- Verificar erros de estrutura de dados
      // cache[cacheKey] = quickSort(dataCopy, 'DataTime'); // ------------------------------------------- Ordenar dados por data e guardar em cache
      const sortedData = quickSort(dataCopy, 'DataTime'); // --------------------------------------------- Ordenar dados por data sem guardar em cache
      // }

      // Declarar paginação pretendida
      const page = parseInt(req.query.page, 10);
      const pageSize = parseInt(req.query.pageSize, 10);

      // Contagem de items/páginas
      const totalItems = sortedData.length; // ----------------------------------------------------------- Buscar numero total de items sem cache
      // const totalItems = cache[cacheKey].length; // --------------------------------------------------- Buscar numero total de items da cache
      const totalPages = Math.ceil(totalItems / pageSize);

      // Calcular inicio e fim baseado em parâmetros de paginação
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      // Fetch, retornar subset consoante paginação
      // const paginatedData = cache[cacheKey].slice(startIndex, endIndex); // --------------------------- Buscar dados da cache
      const paginatedData = sortedData.slice(startIndex, endIndex); // ----------------------------------- Buscar dados sem cache

      // Retornar dados
      if (Number.isInteger(page) && Number.isInteger(pageSize) && page > 0 && pageSize > 0) { // --------- Caso seja necessária paginação dos dados
         res.json({ data: paginatedData, totalItems, totalPages, currentPage: page });
      } else {
         res.json({ data: sortedData });
      }
   } catch (error) {
      handleError(res, error, 400, 'Erro ao buscar dados de reparações - Servidor');
   }
});

// API endpoint para buscar dados de clientes
app.get('/api/getclientes', async (req, res) => {
   try {
      const fileName = req.query.fileName || 'tblClientes.json'; // -------------------------------------- Busca ficheiro
      const jsonData = await readJsonFile(fileName); // -------------------------------------------------- Prepara dados do ficheiro
      const dataCopy = JSON.parse(JSON.stringify(jsonData)); // ------------------------------------------ Deep copy para não alterar jsonData
      if (!Array.isArray(dataCopy)) { throw new Error('Dados num formato inesperado - Servidor'); } // --- Verificar erros de estrutura de dados
      const sortedData = quickSort(dataCopy, 'Nome'); // ------------------------------------------------- Ordenar dados por data sem guardar em cache
      // Retornar dados
      res.json({ data: sortedData });
   } catch (error) {
      handleError(res, error, 400, 'Erro ao buscar dados de clientes - Servidor');
   }
});

// API endpoint para buscar dados de avarias
app.get('/api/getavarias', async (req, res) => {
   try {
      const fileName = req.query.fileName || 'tblAvarias.json'; // --------------------------------------- Busca ficheiro
      const jsonData = await readJsonFile(fileName); // -------------------------------------------------- Prepara dados do ficheiro
      const dataCopy = JSON.parse(JSON.stringify(jsonData)); // ------------------------------------------ Deep copy para não alterar jsonData
      if (!Array.isArray(dataCopy)) { throw new Error('Dados num formato inesperado - Servidor'); } // --- Verificar erros de estrutura de dados
      const sortedData = quickSort(dataCopy, 'Avaria'); // ------------------------------------------------- Ordenar dados por data sem guardar em cache
      // Retornar dados
      res.json({ data: sortedData });
   } catch (error) {
      handleError(res, error, 400, 'Erro ao buscar dados de avarias - Servidor');
   }
});





// |----- ENDPOINTS DE ESCRITA -----|

// API endpoint para escrever dados - WIP
app.post('/api/', async (req, res) => {
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
