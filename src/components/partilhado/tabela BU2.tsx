import React from 'react';
import { Table } from '@mantine/core';

interface GerarTabelaProps {
   data: any[];
   headers: string[];
   currentPage: number;
   itemsPerPage: number;
}

const GerarTabela: React.FC<GerarTabelaProps> = ({ data, headers, currentPage, itemsPerPage }) => {
   // em caso de erro
   if (!data || !headers || !data.length|| !headers.length) {
      return <div>Não existem dados a apresentar</div>;
   }
   
   // inicializar paginação
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const paginatedData = data.slice(startIndex, endIndex);

   const extractValue = (item: any, header: string): any => {
      // para estruturas nested
      const keys = header.split('.');
      
      return keys.reduce((value, key) => {
         // Verificar se o valor é objeto 
         if (value && typeof value === 'object' && key in value) {
            const nestedValue = value[key];

            // verificar se o valor está vazio
            if (nestedValue !== null || nestedValue !== undefined) {
               const specialProperty = Object.keys(nestedValue).find(prop => prop.startsWith('$')); // verifica se o nome começa por $
               if (specialProperty) {    
                  return nestedValue[specialProperty].toString();
               }
               return nestedValue;
            }
         } else {
            return null; // keys em falta/inválidas
         }
      }, item);
   }

   // Popular componente Mantine
   const tableHeaders = headers.map((header) => (
      <Table.Th key={header}>{header}</Table.Th>
   ));
   const tableRows = data.map((item: any, index: number) => (
      <Table.Tr key={index}>
         {headers.map((header) => (
         <Table.Td key={header}>
            {extractValue(item, header)}
         </Table.Td>
         ))}
      </Table.Tr>
   ));
   
   
   return (
      <Table stickyHeader stickyHeaderOffset={60} striped highlightOnHover withTableBorder withColumnBorders>
         <Table.Thead>
            <Table.Tr>{tableHeaders}</Table.Tr>
         </Table.Thead>
         <Table.Tbody>{tableRows}</Table.Tbody>
      </Table>
   );
};

export default GerarTabela;
