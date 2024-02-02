/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect } from 'react';
import { Button, Pagination, Flex, Center, Fieldset, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

// Componentes
import GerarTabelaReparMaq from './reparacoes-tabela';
import NRInternaForm from './Interna/interna-form';
import NRExternaForm from './Externa/externa-form';

// Utils
import fetchData from '../../api/fetchData';
import compareValues from '../../utils/compare-values';
import paginateData from '../../utils/paginate-data';

// Inicialização do tipo de formulário para edição de dados
interface SelectedRowData { IntExt?: string; }





/* |----- COMPONENTE -----| */

const ReparMaqConteudo:React.FC = () => {   

   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   // Estados da tabela
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // Estados de cache
   const [data, setData] = useState<any[]>([]);
   const [cachedData, setCachedData] = useState<any[]>([]);
   const [sortField, setSortField] = useState<string | null>(null);
   const [sortOrder, setSortOrder] = useState('asc');


   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);
   const [opened, { open, close }] = useDisclosure(false);
   const [selectedRowData, setSelectedRowData] = useState<SelectedRowData | null>(null);
   const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

   // Toggle para edição de dados
   const [isFormEditable, setIsFormEditable] = useState(false);
   const toggleFormEditability = () => { setIsFormEditable(current => !current); };





   /* |----- FUNÇÕES "HELPER"/"HANDLER" - Separação de lógica -----| */

   // Refrescamento de dados da tabela
   /*
   const updateTableData = (repairs: any[], page: number) => {
      const pageSize = 30; // Declara o numero de items por página
      const startIndex = (page - 1) * pageSize; // Declara o tamanho de cada página
      const endIndex = startIndex + pageSize;
      setData(repairs.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(repairs.length / pageSize));
   };
   */

   // Paginação - mudança de página
   const handlePageChange = (newPage: number) => { setCurrentPage(newPage); };

   // Seleção de rows
   const handleRowClick = (index: number) => {
      if (selectedRowIndex === index) { setSelectedRowIndex(null); } 
      else { setSelectedRowIndex(index); }
   };
   
   // Duplo-click e edição de dados
   const handleRowDoubleClick = (index: number) => {
      const rowData = data[index]; // dados correspondentes à linha onde o ID é clickado
      setSelectedRowData(rowData);
      setSelectedRowIndex(index);
      //console.log(rowData.DateTime); // testar objeto
      open();
   };

   // Ordenar dados
   const sortData = (field: string) => {
      const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
      const unsortedData = data;
      const sortedData = unsortedData.sort((a, b) => compareValues(a, b, field, order));      
      paginateData(sortedData, 1, 30);
      setSortOrder(order);
      setSortField(field);
      setCachedData(sortedData);
   };

   // Reset à ordem/aos dados
   const resetData = () => {
      setCachedData(data);
      setSortField(null);
      setSortOrder('asc');
   };

   // Handler para guardar dados alterados
   const handleFormSave = () => {
      // 
   };



   /* |----- GESTÃO DE ESTADOS -----| */

   // Buscar dados e atualizar tabela
   useEffect(() => {
      const fetchDataAndUpdateState = async () => {
         setIsLoading(true);
         try {
            const fetchedData = await fetchData('getdata', 'tblRepairList');
            const paginated = paginateData(fetchedData.data, 1, 30)
            if (paginated.totalPages > 0) {
               const primeiroItem = fetchedData.data[0];
               const headerKeys = Object.keys(primeiroItem);
               setHeaders(headerKeys);
               setTotalPages(paginated.totalPages);
            }
            setData(fetchedData.data);
            setCachedData(paginated.data);
         } catch (error) { console.error('Erro ao buscar e atualizar dados - Aplicação:', error); } 
         finally { setIsLoading(false); }
      }
      fetchDataAndUpdateState();      
      return () => {}; // cleanup
   }, [currentPage]);

   // Repõe "disabled" nos elementos de formulário quando Drawer é fechado
   useEffect(() => { if (!opened) { setIsFormEditable(false); } }, [opened]);


   /* |----- JSX / GERAR ELEMENTO -----| */

   return (    
      <div className="bg-gray-100 FIXContainer" >    
         {/* Drawer para formulário / edição de dados */}
         <Drawer 
            opened={opened} 
            onClose={()=>{
               setIsFormEditable(false);
               setSelectedRowIndex(null);
               close();
            }} 
            padding="md" 
            size="xl" 
            position='right' 
            withCloseButton={false}>
            <Flex direction='row' justify='center'>
               <Button className='normalBtn' onClick={toggleFormEditability}>
                  {isFormEditable ? "Cancelar" : "Editar"}
               </Button>
               <Button className='normalBtn' onClick={handleFormSave}>
                  Guardar
               </Button>
            </Flex>
            {selectedRowData && (
               selectedRowData.IntExt === "2" ? 
               <NRExternaForm initialData={selectedRowData} isEditable={isFormEditable} /> : 
               <NRInternaForm initialData={selectedRowData} isEditable={isFormEditable} />
            )}
         </Drawer>

         <Flex
         justify="left"
         direction="row"
         className='p-1 FIXContainer'
         >
            <Fieldset className='flex-1 ml-1 px-2 FIXContainer'>

               {isLoading ? (
                  // Display a loading spinner or message while data is being fetched
                  // <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                  <div>Shit's loading, yo</div>
               ) : (
                  <Flex 
                  className="flex-col mb-1 px-4 pb-4 FIXContainer" 
                  align={totalPages <= 1 ? 'center' : ''}
                  justify={totalPages <= 1 ? 'center' : ''}
                  >
                     <Center>
                        <Pagination
                        total={totalPages}
                        value={currentPage}
                        onChange={handlePageChange}
                        siblings={3}
                        boundaries={2}
                        withEdges
                        className='m-1'
                        />
                     </Center>
                     <GerarTabelaReparMaq 
                     data={cachedData} 
                     headers={headers} 
                     onHeaderClick={sortData}
                     sortField={sortField}
                     sortOrder={sortOrder}
                     onRowDoubleClick={handleRowDoubleClick}
                     onRowClick={handleRowClick}
                     selectedRowIndex={selectedRowIndex}
                     resetData={resetData}
                     />  
                  </Flex>
               )}
            </Fieldset>
         </Flex>
      </div>
   );
};

export default ReparMaqConteudo;