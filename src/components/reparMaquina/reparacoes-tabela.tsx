/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useCallback } from 'react';
import { Table, ScrollArea } from '@mantine/core';
import { useContextMenu } from 'mantine-contextmenu';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

// Componentes
import formatarData from '../../utils/formatar-data';
import separarArray from '../../utils/separar-arrays';
import Observacoes from '../partilhado/observacoes';

// Inicialização do tipo de dados da tabela
interface GerarTabelaProps {
   data: any[];
   headers: string[];
   onHeaderClick: (header: string) => void;
   sortField: string | null;
   sortOrder: string | null;
   onRowClick: (index: number) => void;
   selectedRowIndex: number | null;
   onRowDoubleClick: (rowId: any) => void;
   resetData: () => void;
}
interface NomesColunasRepar { [key: string]: string; }





/* |----- COMPONENTE -----| */

const GerarTabelaReparMaq: React.FC<GerarTabelaProps> = ({ data, headers, onHeaderClick, sortField, sortOrder, onRowClick, onRowDoubleClick, selectedRowIndex, resetData }) => {

   // Em caso de erro
   if (!data || !headers) { return <div>Não existem dados a apresentar</div>; }


   /* |----- INICIALIZAÇÃO DE ESTADOS / VARIÁVEIS -----| */

   // Menu de contexto (botão direito do rato)
   const {showContextMenu} = useContextMenu();

   // Render sort icons for table headers
   const renderSortIcon = (field: string) => {
      return field === sortField && (sortOrder === 'asc' ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />);
   };

   // Inicializar campos mostrados/filtrados
   const colunasMostradasRepar: string[] = [
      'OrdemReparacao',
      'NumMaquina', 
      'Marca', 
      'Maquina',
      'ModeloElectrex',
      'Tipo', 
      'Avarias',
      'Observacoes', 
      'DataTime', 
      'Cliente',
      'Acessorios', 
      'Actualizada'
   ]

   // Tornar campos mais legíveis
   const nomesColunasRepar: NomesColunasRepar = {      
      'OrdemReparacao':'Ordem Reparação',
      'NumMaquina':'Num. Série', 
      'Marca':'Marca', 
      'Maquina':'Maquina',
      'ModeloElectrex':'Modelo Electrex',
      'Tipo':'Tipo', 
      'Avarias':'Avarias',
      'Observacoes':'Observações', 
      'DataTime':'Data', 
      'Cliente':'Cliente',
      'Acessorios':'Acessórios', 
      'Actualizada':'Atualizada'
   } 





   /* |----- LÓGICA -----| */

   //Lógica para menu de contexto
   const contextMenuHandler = useCallback((index:number) => showContextMenu([
      {
         key: 'reset',
         onClick: () => resetData(),
         title: 'Reset sorting',
      },
      {
         key: 'edit',
         onClick: () => onRowDoubleClick(index),
         title: 'Edit data',
      },
   ]), [resetData, onRowDoubleClick]);

   // Gerar Headers
   const tableHeaders = colunasMostradasRepar
   .filter(header => colunasMostradasRepar.includes(header)) // Filtrar campos desnecessários
   .map((header) => ( // Gear headers da tabela dinamicamente
      <Table.Th 
      key={header} 
      onClick={()=>onHeaderClick(header)} 
      >
         {nomesColunasRepar[header] || header}  
         {renderSortIcon(header)} 
      </Table.Th> 
   ));

   // Gerar células
   const tableRows = data.map((item, index) => (
      <Table.Tr 
      key={index} 
      data-index={index} 
      onClick={() => onRowClick(index)} // single click
      onDoubleClick={()=> onRowDoubleClick(index)} // double click
      onContextMenu={ contextMenuHandler(index) } // right click
      style={{
         borderColor: selectedRowIndex ? ( selectedRowIndex === index ? '#black' : '#dee2e6') : '#dee2e6',
      }} >
         {colunasMostradasRepar.map((header) => (
            colunasMostradasRepar.includes(header) && 
            <Table.Td
            key={header}
            style={{
               borderColor: selectedRowIndex ? ( selectedRowIndex === index ? '#black' : '#dee2e6') : '#dee2e6',
               color: selectedRowIndex ? (selectedRowIndex === index ? 'black' : '#bbbbbb') : 'black',
               userSelect: 'none',
            }} >
               {
                  header === 'DataTime' ? formatarData(item[header]) : 
                  header === 'Observacoes' ? <Observacoes obData={item[header]} /> : 
                  separarArray(item[header])
               }
            </Table.Td>
         ))}
      </Table.Tr>
   ));





   /* |----- JSX / GERAR ELEMENTO -----| */

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

export default GerarTabelaReparMaq;