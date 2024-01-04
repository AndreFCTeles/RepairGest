import React from 'react';
import { Table } from '@mantine/core';

interface GerarTabelaProps {
   data: any[];
   headers: string[];
}

const GerarTabela: React.FC<GerarTabelaProps> = ({ data, headers }) => {
   // em caso de erro
   if (!data || !headers || data.length === 0 || headers.length === 0) {
      return <div>Não existem dados a apresentar</div>;
   }

   const extractValue = (item: any, header: string): any => {
      // para estruturas nested
      const keys = header.split('.');
      
      return keys.reduce((value, key) => {
         // Verificar se o valor é objeto 
         if (value && typeof value === 'object' && key in value) {
            const nestedValue = value[key];

            // verificar se o valor está vazio
            if (nestedValue !== null && nestedValue !== undefined) {
               const specialProperty = Object.keys(nestedValue).find(prop => prop.startsWith('$')); // verifica se o nome começa por $
               const observa = Object.keys(nestedValue).find(prop => prop.includes('Observacoes')); // verifica se a key é "Observacoes"
               if (specialProperty) {
                  return nestedValue[specialProperty].toString();
               } else if (observa) {
                  
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
   
   // Criar tabela propriamente dita
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