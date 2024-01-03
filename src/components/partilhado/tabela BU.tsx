import React, {useState, useEffect} from 'react';
import { Table, Pagination } from '@mantine/core';
//import { VariableSizeGrid as Grid } from 'react-window';


// Transforma os dados em strings e elimina dados a mais
const flattenObject = (obj: any): { [key: string]: string } => {
   const result: { [key: string]: string } = {};
   const recurse = (current: any, path: string[] = []) => {
      for (const [key, value] of Object.entries(current)) {
         const newPath = path.concat(key);

         if (typeof value === 'object' && value !== null) {
         recurse(value, newPath);
         } else {
         result[newPath.join('.')] = String(value);
         }
      }
   };
   recurse(obj);
   return result;
};

const Tabela: React.FC<{ data: any }> = ({ data }) => {
   // Mensagem de loading
   if (!data) { return <p>A carregar dados...</p>; }

   // Transforma os dados em strings e elimina dados a mais
   const flattenedData = data.map(flattenObject)
   const keys = Object.keys(flattenedData[0]); // Chave da tabela

   // Configura paginação na tabela
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10; // Ajusta número de items por página
   const inicio = (currentPage - 1) * itemsPerPage;
   const fim = inicio + itemsPerPage;
   const paginatedData = flattenedData.slice(inicio, fim);
   
   // Estado da tabela
   const [repairs, setRepairs] = useState([]);


   useEffect(() => {
      const fetchData = async () => {
         try {
         const response = await fetch('http://localhost:3000/api/');
         const data = await response.json();
         setRepairs(data);
         } catch (error) {
         console.error('Error fetching repairs:', error);
         }
      };

      fetchData();
   }, []);


   return (
      <div>
         <h2>JSON Data Table</h2>
         <Table striped highlightOnHover withTableBorder withColumnBorders className='w-full'>

         <thead>
            <tr>
               {keys.map((key, index) => (
               <th key={index}>{key}</th>
               ))}
            </tr>
         </thead>
         <tbody>
            {paginatedData.map((row, rowIndex) => (
               <tr key={rowIndex}>
               {keys.map((key, colIndex) => (
                  <td key={colIndex}>{row[key]}</td>
               ))}
               </tr>
            ))}
         </tbody>
         </Table>
         <Pagination 
         total={flattenedData.length}
         value={currentPage}
         onChange={(page) => setCurrentPage(page)}
         withEdges
         />
      </div>
   );
};

export default Tabela;

         {/* perPage={itemsPerPage} */} 