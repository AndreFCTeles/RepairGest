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
app.use(express.urlencoded({ extended: true })); // --- Permite decompor URLs para melhor POST de dados de formulários
app.use(cors()); // ----------------------------------- CORS básico para cross-referencing de origens cliente-servidor
app.use('/files', express.static(dataFilePath)); // --- Servir ficheiros JSON estáticos a partir de caminho

// Objeto temporário para cache
let cache = {};





/* |----- FUNÇÕES PARA FUNCIONALIDADES DO SERVIDOR - Funções "Helper" -----| */

/**
 * Lê ficheiros JSON de forma assíncrona
 * @param {string} fileName - Nome do ficheiro a ler
 * @returns {Promise<any[]>} - Uma promessa que resolve com dados parsed (decomposto) a partir de JSON
 */

// Ler ficheiro JSON
const readJsonFile = async (fileName) => {
   const filePath = path.join(dataFilePath, fileName);
   if (cache[filePath]) { return cache[filePath]; }
   try {
      const jsonData = await fs.readFile(filePath, 'utf-8');
      const parsedJsonData = JSON.parse(jsonData);
      cache[filePath] = parsedJsonData;
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
   const totalItems = data.length;
   const totalPages = Math.ceil(totalItems / pageSize);

   // Calcular inicio e fim baseado em parâmetros de paginação
   const startIndex = (page - 1) * pageSize;
   const endIndex = startIndex + pageSize;

   // Fetch, retornar subset consoante paginação
   const paginatedData = data.slice(startIndex, endIndex);

   return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page
   };
}





/* |----- FUNÇÕES PARA COMPARAÇÃO/ORDENAÇÃO DE VALORES -----| */

// Algoritmo Timsort - https://pt.wikipedia.org/wiki/Timsort
const compareValues = (a, b, field, sortOrder) => {
   let valueA = a[field], valueB = b[field];

   if (valueA instanceof Date && valueB instanceof Date) { // Comparar datas
      valueA = valueA.getTime();
      valueB = valueB.getTime();
   } else if (Array.isArray(valueA) && Array.isArray(valueB)) { // Comparar arrays
      valueA = valueA[0]?.toString().charAt(0) || "";
      valueB = valueB[0]?.toString().charAt(0) || "";
   }

   return sortOrder === 'asc' ? valueA < valueB ? -1 : 1 : valueA > valueB ? -1 : 1;
};





// |----------------------------|
// |----- ENDPOINTS DA API -----|
// |----------------------------|


// |----- ENDPOINTS DE BUSCA -----|

// API endpoint para buscar dados (pre-paginados, pre-ordenados)
app.get('/api/getpagdata', async (req, res) => {
   try {
      const { dataType, sortField = "DataTime", sortOrder = 'desc', page = 1, pageSize = 30 } = req.query; // valores por defeito de paginação e ordenação
      const fileName = `${dataType}.json`;
      const data = await readJsonFile(fileName);

      if (!Array.isArray(data)) { throw new Error('Dados num formato inesperado - Servidor'); }

      const effectiveSortField =
         data[0] && data[0].hasOwnProperty(sortField) ? sortField :
            data[0] && data[0].hasOwnProperty('ID') ? 'ID' : '_id';


      data.sort((a, b) => compareValues(a, b, effectiveSortField, sortOrder));
      const paginatedResult = paginateData(data, parseInt(page, 10), parseInt(pageSize, 10));
      res.json(paginatedResult);
   } catch (error) { handleError(res, error, 400, 'Erro ao buscar dados paginados - Servidor'); }
});

// API endpoint para buscar dados
app.get('/api/getdata', async (req, res) => {
   try {
      const { dataType, sortField = "DateTime", sortOrder = 'desc' } = req.query;
      const fileName = `${dataType}.json`;
      const data = await readJsonFile(fileName);

      if (!Array.isArray(data)) { throw new Error('Dados num formato inesperado - Servidor'); }
      const effectiveSortField =
         data[0] && data[0].hasOwnProperty(sortField) ? sortField :
            data[0] && data[0].hasOwnProperty('ID') ? 'ID' : '_id';

      data.sort((a, b) => compareValues(a, b, effectiveSortField, sortOrder));
      res.json({ data });
   } catch (error) { handleError(res, error, 400, 'Erro ao buscar dados paginados - Servidor'); }
});

// API endpoint para buscar data/hora
app.get('/api/currentDateTime', (req, res) => {
   try {
      const currentDateTime = new Date();
      res.json({ dateTime: currentDateTime.toISOString() });
   } catch (error) { handleError(res, error, 400, 'Erro ao buscar data/hora - Servidor'); }
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
