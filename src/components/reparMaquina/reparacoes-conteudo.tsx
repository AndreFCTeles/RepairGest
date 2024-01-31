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
   const [cachedData, setCachedData] = useState<any[]>([]);

   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);

   // Edição de dados
   const [opened, { open, close }] = useDisclosure(false);
   const [isFormEditable, setIsFormEditable] = useState(false);
   const [selectedRowData, setSelectedRowData] = useState<SelectedRowData | null>(null);
   const toggleFormEditability = () => { setIsFormEditable(current => !current); };

   // Gravar dados após edição
   //const [isFormChanged, setIsFormChanged] = useState(false);





   /* |----- FUNÇÕES "HELPER"/"HANDLER" - Separação de lógica -----| */

   // Paginação - mudança de página
   const handlePageChange = (newPage: number) => { setCurrentPage(newPage); };

   // Duplo-click e edição de dados
   const handleRowDoubleClick = (index: number) => {
      setSelectedRowData(displayData ? displayData[index] : cachedData[index]);
      //console.log(rowData.DateTime); // testar objeto
      open();
   };

   // Reset à ordem/aos dados
   const resetData = () => {
      setDisplayData(cachedData);
      setSortField(null);
      setSortOrder('asc');
   };

   // Handler para guardar dados alterados
   const handleFormSave = () => {
      // 
   };

   /*
   // Determinar o que ordenar, em que ordem
   const sortData = (field: string) => {
      const isSameField = field === sortField;
      setSortField(field);
      setSortOrder(isSameField && sortOrder === 'asc' ? 'desc' : 'asc');
   };
*/
   // Usar a memória em vez de operações estáticas para ordenar dados
   /*
   const sortedData = useMemo(() => {
      return sortField ? quickSort([...displayData], sortField, sortOrder) : displayData;
   }, [displayData, sortField, sortOrder]);
*/




   /* |----- GESTÃO DE ESTADOS -----| */

   // Buscar dados e atualizar tabela
   useEffect(() => {
      const fetchDataAndUpdateState = async () => {
         setIsLoading(true);
         try {
            const fetchedData = await fetchData('getrepar', currentPage, 30);
            if (fetchedData.totalPages > 0) {
               setHeaders(Object.keys(fetchedData.data[0]));
               setTotalPages(fetchedData.totalPages);
            }
            setCachedData(fetchedData.data);
            setDisplayData(fetchedData.data);
         } catch (error) { console.error('Erro ao buscar e atualizar dados - Aplicação:', error); } 
         finally { setIsLoading(false); }
      }
      fetchDataAndUpdateState();      
      return () => {}; // cleanup
   }, [currentPage]);

   // Repõe "disabled" nos elementos de formulário quando Drawer é fechado
   useEffect(() => { if (!opened) { setIsFormEditable(false); } }, [opened]);

   // Guardar dados ordenados em cache
   //useEffect(() => { updateTableData(sortedData); }, [sortedData]);

   // Refrescar dados da Tabela consoante a página escolhida
   /*
   useEffect(() => {
      const pageSize = 30;
      const totalItems = sortedData.length;
      const startIndex = (currentPage - 1) * pageSize;
      let endIndex = startIndex + pageSize;
      endIndex = endIndex > totalItems ? totalItems : endIndex;

      if (startIndex < totalItems) {
         setPaginatedData(sortedData.slice(startIndex, endIndex));
      } else if (currentPage > 1) {
         setCurrentPage(prevPage => prevPage - 1);
      } else {
         setPaginatedData([]);
      }
   }, [sortedData, currentPage]);
   */

   /*
   const updateTableData = (data: any[]) => {
      const pageSize = 30;
      const totalItems = data.length;
      const startIndex = (currentPage - 1) * pageSize;
      let endIndex = startIndex + pageSize;
      endIndex = endIndex > totalItems ? totalItems : endIndex;

      if (startIndex < totalItems) { setPaginatedData(data.slice(startIndex, endIndex)); } 
      else if (currentPage > 1) { setCurrentPage(currentPage - 1); } 
      else { setPaginatedData([]); }
   };
   */



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
                     data={paginatedData} 
                     headers={headers} 
                     onHeaderClick={sortData}
                     resetData={resetData}
                     onRowDoubleClick={handleRowDoubleClick}
                     sortField={sortField}
                     sortOrder={sortOrder}
                     />  
                  </Flex>
               )}
            </Fieldset>
         </Flex>
      </div>
   );
};

export default ReparMaqConteudo;