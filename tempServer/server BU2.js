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

// Inicialização de frameworks
app.use(express.json());  // -------------------------- Funcionalidades básicas Express para funcionalidades do servidor
app.use(cors()); // ----------------------------------- CORS básico para cross-referencing de origens cliente-servidor
app.use('/files', express.static(dataFilePath)); // --- Servir ficheiros JSON estáticos a partir de caminho

// Objeto temporário para cache
let cache = {}; // Cache disabled





/* |----- FUNÇÕES PARA FUNCIONALIDADES DO SERVIDOR - Funções "Helper" -----| */

// Ler ficheiro JSON
const readJsonFile = async (fileName) => {
   const filePath = path.join(dataFilePath, fileName);
   if (cache[filePath]) { return cache[filePath]; }
   try {
      const jsonData = await fs.readFile(filePath, 'utf-8');
      const parsedJsonData = JSON.parse(jsonData);
      cache[filePath] = parsedJsonData;
      //console.log('Amostra de dados:', parsedJsonData[0]);
      return parsedJsonData;
   }
   catch (error) { throw error; }
};

// Error handling
const handleError = (res, error, message = 'Erro') => {
   console.error(`${message}: ${error.message}`);
   res.status(500).json({ error: message });
};

// Paginar data caso seja pedido no frontend
function paginateData(data, page, pageSize) {

   // Contagem de items/páginas
   // const totalItems = cache[cacheKey].length; // ------------------------------------------------------- Buscar numero total de items da cache
   const totalItems = data.length; // --------------------------------------------------------------------- Buscar numero total de items sem cache
   const totalPages = Math.ceil(totalItems / pageSize);

   // Calcular inicio e fim baseado em parâmetros de paginação
   const startIndex = (page - 1) * pageSize;
   const endIndex = startIndex + pageSize;

   // Fetch, retornar subset consoante paginação
   // const paginatedData = cache[cacheKey].slice(startIndex, endIndex); // ------------------------------- Buscar dados da cache
   const paginatedData = data.slice(startIndex, endIndex); // --------------------------------------------- Buscar dados sem cache

   return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page
   };
}

/* |----- FUNÇÕES PARA COMPARAÇÃO/ORDENAÇÃO DE VALORES -----| */
/*
// Comparar dois valores para sorting - ordenar por data
const dateCompareFunction = (a, b) => {
   const dateA = new Date(a.DataTime || 0);
   const dateB = new Date(b.DataTime || 0);
   //console.log(`A comparar: ${dateA} e ${dateB}`); // debug
   return dateB - dateA;
}
// Comparar dois valores para sorting - ordenar por string
const stringCompareFunction = (a, b, field) => {
   const strA = a[field] || "";
   const strB = b[field] || "";
   //console.log(`A comparar: ${strA} e ${strB}`); // debug
   if (strA < strB) { return -1; }
   if (strA > strB) { return 1; }
   return 0;
};
*/

// Algoritmo QuickSort - https://pt.wikipedia.org/wiki/Quicksort
/*
function quickSort(arr, field) {
   if (arr.length < 2) return arr; // --------------------------------------------------------------------- arr.length = 1 ou 0, aceitar valor simples em vez de array (=já ordenado)   
   const compareFunction = field === 'DataTime' ? dateCompareFunction : stringCompareFunction; // --------- Determinar tipo de comparação dependendo do tipo de dados recebidos
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
*/

// Algoritmo Timsort - https://pt.wikipedia.org/wiki/Timsort
const compareValues = (a, b, field, sortOrder) => {
   let valueA = a[field], valueB = b[field];

   // Comparar datas
   if (valueA instanceof Date && valueB instanceof Date) {
      valueA = valueA.getTime();
      valueB = valueB.getTime();
   }

   // Comparar arrays
   if (Array.isArray(valueA) && Array.isArray(valueB)) {
      valueA = valueA[0]?.toString().charAt(0) || "";
      valueB = valueB[0]?.toString().charAt(0) || "";
   }

   /* // Comparação standard
   if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
   if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
   */

   //return 0;
   return sortOrder === 'asc' ? valueA < valueB ? -1 : 1 : valueA > valueB ? -1 : 1;
};



// |----------------------------|
// |----- ENDPOINTS DA API -----|
// |----------------------------|


// |----- ENDPOINTS DE BUSCA -----|

// API endpoint para buscar dados (pre-paginados, pre-ordenados)
/*
app.get('/api/getpagdata', async (req, res) => {
   try {
      const dataType = req.query.dataType;
      const fileName = `${dataType}.json`;
      const sortField = req.query.sortField || "_id" || "ID";
      const sortOrder = req.query.sortOrder || 'desc';
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10);

      const jsonData = await readJsonFile(fileName);
      const dataCopy = JSON.parse(JSON.stringify(jsonData));
      if (!Array.isArray(dataCopy)) { throw new Error('Dados num formato inesperado - Servidor'); }

      dataCopy.sort((a, b) => compareValues(a, b, sortField, sortOrder));

      if (Number.isInteger(page) && Number.isInteger(pageSize) && page > 0 && pageSize > 0) {
         const paginatedResult = paginateData(dataCopy, page, pageSize);
         res.json(paginatedResult);
      } else {
         res.json({ data: dataCopy });
      }
   } catch (error) { handleError(res, error, 400, 'Erro ao buscar dados - Servidor'); }
});
*/
app.get('/api/getpagdata', async (req, res) => {
   try {
      const { dataType, sortField = "DataTime", sortOrder = 'desc', page = 1, pageSize = 30 } = req.query;

      const fileName = `${dataType}.json`;
      const data = await readJsonFile(fileName);

      if (!Array.isArray(data)) { throw new Error('Dados num formato inesperado - Servidor'); }

      const effectiveSortField = data.some(item => item[sortField]) ? sortField : (data.some(item => item["ID"]) ? "ID" : "_id");

      data.sort((a, b) => compareValues(a, b, sortField, sortOrder));
      const paginatedResult = paginateData(data, parseInt(page, 10), parseInt(pageSize, 10));

      res.json(paginatedResult);
   } catch (error) { handleError(res, error, 400, 'Erro ao buscar dados paginados - Servidor'); }
});

// API endpoint para buscar dados
app.get('/api/getdata', async (req, res) => {
   try {
      const dataType = req.query.dataType;
      const fileName = `${dataType}.json`;

      const jsonData = await readJsonFile(fileName);
      const dataCopy = JSON.parse(JSON.stringify(jsonData));
      if (!Array.isArray(dataCopy)) { throw new Error('Dados num formato inesperado - Servidor'); }
      res.json({ data: dataCopy });
   } catch (error) { handleError(res, error, 400, 'Erro ao buscar dados - Servidor'); }
});

// API endpoint para buscar data/hora
app.get('/api/currentDateTime', (req, res) => {
   try {
      const currentDateTime = new Date();
      res.json({ dateTime: currentDateTime.toISOString() });
   } catch (error) {
      handleError(res, error, 400, 'Erro ao buscar data/hora - Servidor');
   }
});





// |----- ENDPOINTS DE ESCRITA -----|

// API endpoint para escrever dados - WIP
app.post('/api/novareparmaq', async (req, res) => {
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

// API endpoint para escrever dados - WIP
app.post('/api/novareparcir', async (req, res) => {
   try {
      const fileName = req.query.fileName || 'tblCircuitoList.json';
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
