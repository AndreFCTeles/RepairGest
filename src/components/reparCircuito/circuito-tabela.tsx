/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React from 'react';
import { Table, ScrollArea } from '@mantine/core';

// Componentes
import formatarData from '../../utils/formatar-data';
import separarArray from '../../utils/separar-arrays';
import Observacoes from '../partilhado/observacoes';

// Inicialização do tipo de dados da tabela
interface GerarTabelaProps {
   data: any[];
   headers: string[];
   onRowDoubleClick: (rowId: any) => void;
}
interface NomesColunasRepar { [key: string]: string; }





/* |----- COMPONENTE -----| */

const GerarTabelaReparCir: React.FC<GerarTabelaProps> = ({ data, headers, onRowDoubleClick }) => {

    // Em caso de erro
   if (!data || !headers) { return <div>Não existem dados a apresentar</div>; }


   /* |----- INICIALIZAÇÃO DE CAMPOS -----| */

   // Inicializar campos mostrados/filtrados
   const colunasMostradasRepar: string[] = [
      'OrdemRep',
      'Numero', 
      'Circuito', 
      'Revisao',
      'Observacoes', 
      'DataTime', 
      'Origem',
      'Estado'
   ]

   // Tornar campos mais legíveis
   const nomesColunasRepar: NomesColunasRepar = {      
      'OrdemRep':'Ordem Rep.',
      'Numero':'Num. Série', 
      'Circuito':'Circuito', 
      'Revisao':'Revisão',
      'Origem':'Origem',
      'Observacoes':'Observações', 
      'DataTime':'Data',
      'Estado':'Estado' 
   }





   /* |----- LÓGICA -----| */

   // Gerar Headers
   const tableHeaders = colunasMostradasRepar
   .filter(header => colunasMostradasRepar.includes(header)) // filtrar campos desnecessários
   .map((header) => ( <Table.Th key={header}>{nomesColunasRepar[header] || header}</Table.Th> ));

   // Gerar células
   const tableRows = data.map((item, index) => (
      <Table.Tr key={index} data-index={index} onDoubleClick={()=>handleDoubleClick(index)} >
         {colunasMostradasRepar.map((header) => (
            colunasMostradasRepar.includes(header) && 
            <Table.Td key={header}>
               {
                  header === 'DataTime' ? formatarData(item[header]): 
                  header === 'Observacoes' ? <Observacoes obData={item[header]} /> : 
                  separarArray(item[header])
               }
            </Table.Td>
         ))}
      </Table.Tr>
   ));

   // Duplo-click para edição de dados
   const handleDoubleClick = (index: number) => { onRowDoubleClick(index); };





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

export default GerarTabelaReparCir;