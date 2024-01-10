import React from 'react';
import { Table, Menu, Button, ScrollArea } from '@mantine/core';
import formatarData from '../../utils/formatar-data';
import separarArray from '../../utils/separar-arrays';

interface GerarTabelaProps {
   data: any[];
   headers: string[];
}
interface NomesColunasCliente {
   [key: string]: string;
}

const GerarTabelaCli: React.FC<GerarTabelaProps> = ({ data, headers }) => {
   // Em caso de erro
   if (!data || !headers) { return <div>Não existem dados a apresentar</div>; }

   // Inicializar campos mostrados/filtrados
   const colunasMostradasCliente: string[] = [
      'Cliente',
      'OrdemReparacao',
      'Marca', 
      'Maquina',
      'ModeloElectrex',
      'Tipo', 
      'DataTime', 
      'Avarias',
      'Observacoes'
   ]

   // Tornar campos mais legíveis
   const nomesColunasCliente: NomesColunasCliente = {      
      'Cliente':'Cliente',     
      'OrdemReparacao':'Ordem Reparação',
      'Marca':'Marca', 
      'Maquina':'Maquina',
      'ModeloElectrex':'Modelo Electrex',
      'Tipo':'Tipo', 
      'DataTime':'Data', 
      'Avarias':'Avarias',
      'Observacoes':'Observações', 
   }

   // Tornar "Observações" em botão para visualizar os dados de maneira menos intrusiva
   const observacoes = (obData:string) => (
      <Menu shadow="md" width={200}>
         <Menu.Target>
               <Button className="navButton">Ver</Button>
         </Menu.Target>
         <Menu.Dropdown>
               <Menu.Item>{obData}</Menu.Item>
         </Menu.Dropdown>
      </Menu>
   );

   // Gerar Headers
   const tableHeaders = colunasMostradasCliente
   .filter(header => colunasMostradasCliente.includes(header)) // filtrar campos desnecessários
   .map((header) => ( <Table.Th key={header}>{nomesColunasCliente[header] || header}</Table.Th> ));

   // Gerar células
   const tableRows = data.map((item, index) => (
      <Table.Tr key={index}>
         {colunasMostradasCliente.map((header) => (
            colunasMostradasCliente.includes(header) && 
            <Table.Td key={header}>
               {
                  header === 'DataTime' ? formatarData(item[header]) : 
                  header === 'Observacoes' ? observacoes(item[header]) : 
                  separarArray(item[header])
               }
            </Table.Td>
         ))}
      </Table.Tr>
   ));

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

export default GerarTabelaCli;