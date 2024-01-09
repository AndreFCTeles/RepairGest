import React from 'react';
import { Table, Menu, Button, ScrollArea } from '@mantine/core';

interface GerarTabelaProps {
   data: any[];
   headers: string[];
}

const GerarTabela: React.FC<GerarTabelaProps> = ({ data, headers }) => {
   // em caso de erro
   if (!data || !headers) { return <div>Não existem dados a apresentar</div>; }

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

   // Componente Observações
   const observacoes = (obData:string)=>{
      return(
         <Menu shadow="md" width={200}>
            <Menu.Target>
               <Button className="navButton">Ver</Button>
            </Menu.Target>
            <Menu.Dropdown>
               <Menu.Item>
                  {obData}
               </Menu.Item>
            </Menu.Dropdown>
         </Menu>
      )
   };
   // Popular componente Mantine
   const tableHeaders = headers.map((header) => (
      <Table.Th key={header}>{header}</Table.Th>
   ));
   const tableRows = data.map((item: any, index: number) => (
      <Table.Tr key={index}>
         {headers.map((header) => (
         <Table.Td key={header}>
            {header==='Observacoes' ? observacoes(extractValue(item, header)):extractValue(item, header)}
         </Table.Td>
         ))}
      </Table.Tr>
   ));
   
   // Criar tabela propriamente dita
   return (
      <ScrollArea>
         <Table stickyHeader stickyHeaderOffset={0} striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
               <Table.Tr>{tableHeaders}</Table.Tr>
            </Table.Thead>
            <Table.Tbody>{tableRows}</Table.Tbody>
         </Table>
      </ScrollArea>
   );
};

export default GerarTabela;