/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect } from 'react';
import { Button, Pagination, Flex, Center, Fieldset, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Componentes
import GerarTabelaReparMaq from './reparacoes-tabela';
import NRInternaForm from './Interna/interna-form';
import NRExternaForm from './Externa/externa-form';

// Utils
import fetchData from '../../api/fetchData';
import quickSort from '../../utils/quickSort';

// Inicialização do tipo de formulário para edição de dados
interface SelectedRowData { IntExt?: string; }





/* |----- COMPONENTE -----| */

const ReparMaqConteudo:React.FC = () => {   

   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   // Estados da tabela
   const [data, setData] = useState<any[]>([]);
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // Estados de cache/sorting
   const [cachedData, setCachedData] = useState<any[]>([]);
   const [sortField, setSortField] = useState<string | null>(null);
   const [sortOrder, setSortOrder] = useState('asc');

   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);
   const [opened, { open, close }] = useDisclosure(false);
   const [selectedRowData, setSelectedRowData] = useState<SelectedRowData | null>(null);

   // Toggle para edição de dados
   const [isFormEditable, setIsFormEditable] = useState(false);
   const toggleFormEditability = () => { setIsFormEditable(current => !current); };

   // Gravar dados após edição
   //const [isFormChanged, setIsFormChanged] = useState(false);





   /* |----- GESTÃO DE ESTADOS -----| */

   // Buscar dados e atualizar tabela
   useEffect(() => {
      const fetchDataAndUpdateState = async () => {
         try {
            setIsLoading(true);
            const fetchedData = await fetchData('getrepar', currentPage, 30);

            if (fetchedData.totalPages > 0) {
               const primeiroItem = fetchedData.data[0];
               const headerKeys = Object.keys(primeiroItem);
               setHeaders(headerKeys);
               setTotalPages(fetchedData.totalPages);
            }
            setData(fetchedData.data);
            setCachedData(fetchedData.data);
         } catch (error) {
            console.error('Erro ao buscar e atualizar dados - Aplicação:', error);
         } finally {
            setIsLoading(false);
         }
      }
      fetchDataAndUpdateState();      
      return () => {}; // cleanup
   }, [currentPage]);

   // Repõe "disabled" nos elementos de formulário quando Drawer é fechado
   useEffect(() => { if (!opened) { setIsFormEditable(false); } }, [opened]);





   /* |----- FUNÇÕES "HELPER"/"HANDLER" - Separação de lógica -----| */

   // Paginação - mudança de página
   const handlePageChange = (newPage: number) => { setCurrentPage(newPage); };
   
   // Duplo-click e edição de dados
   const handleRowDoubleClick = (index: number) => {
      const rowData = cachedData[index]; // dados correspondentes à linha onde o ID é clickado
      setSelectedRowData(rowData);
      //console.log(rowData.DateTime); // testar objeto
      open();
   };

   // Ordenar dados
   const sortData = (field: string) => {
      const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
      const sortedData = quickSort(cachedData, field, order);
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





   /* |----- JSX / GERAR ELEMENTO -----| */

   return (    
      <div className="bg-gray-100 FIXContainer" >    
         {/* Drawer para formulário / edição de dados */}
         <Drawer 
            opened={opened} 
            onClose={()=>{
               setIsFormEditable(false);
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
                     resetData={resetData}
                     onRowDoubleClick={handleRowDoubleClick}
                     />  
                  </Flex>
               )}
            </Fieldset>
         </Flex>
      </div>
   );
};

export default ReparMaqConteudo;