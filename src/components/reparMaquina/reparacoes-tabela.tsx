/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React from 'react';
import { Table, ScrollArea, Flex } from '@mantine/core';
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
   onRowDoubleClick: (rowId: any) => void;
   onHeaderClick: (header: string) => void;
   resetData: () => void;
   sortField: string | null;
   sortOrder: 'asc' | 'desc';
}
interface NomesColunasRepar { [key: string]: string; }





/* |----- COMPONENTE -----| */

const GerarTabelaReparMaq: React.FC<GerarTabelaProps> = ({ data, headers, onRowDoubleClick, onHeaderClick, resetData, sortField, sortOrder }) => {

   /* |----- INICIALIZAÇÃO DE ESTADOS / VARIÁVEIS -----| */

   // Em caso de erro
   if (!data || !headers) { return <div>Não existem dados a apresentar</div>; }

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

   // Gerar Headers
   const tableHeaders = colunasMostradasRepar
   .filter(header => colunasMostradasRepar.includes(header)) // Filtrar campos desnecessários
   .map((header) => ( // Gear headers da tabela dinamicamente
      <Table.Th key={header} onClick={()=>onHeaderClick(header)} >
         <Flex direction='row' align='center'>
            {nomesColunasRepar[header] || header}  
            {renderSortIcon(header)} 
         </Flex>
      </Table.Th> 
   ));

   // Gerar células
   const tableRows = data.map((item, index) => (
      <Table.Tr 
      key={index} 
      data-index={index} 
      // Edição de dados (duplo click)
      onDoubleClick={() => onRowDoubleClick(index)} 
      // Menu de contexto (botão direito do rato)
      onContextMenu={showContextMenu([
         {
            key: 'reset',
            onClick: resetData,
            title: 'Ordenar por data',
         },
         {
            key: 'editar',
            onClick: () => onRowDoubleClick(index),
            title: 'Editar dados',
         }
      ])}
      >
         {/* Gerar tabela dinamicamente */}
         {colunasMostradasRepar.map((header) => (
            colunasMostradasRepar.includes(header) && 
            <Table.Td key={header}>
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