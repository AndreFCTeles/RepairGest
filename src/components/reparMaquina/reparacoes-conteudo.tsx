/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect } from 'react';
import { Pagination, Flex, Center, Fieldset, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Componentes
import fetchData from '../../api/fetchData';
import GerarTabelaReparMaq from './reparacoes-tabela';
import NRInternaForm from './Interna/interna-form';
import NRExternaForm from './Externa/externa-form';

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

   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);
   const [opened, { open, close }] = useDisclosure(false);
   const [selectedRowData, setSelectedRowData] = useState<SelectedRowData | null>(null);





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
         } catch (error) {
            console.error('Erro ao buscar e atualizar dados - Aplicação:', error);
         } finally {
            setIsLoading(false);
         }
      }
      fetchDataAndUpdateState();      
      return () => {}; // cleanup
   }, [currentPage]);




   
   /* |----- FUNÇÕES "HELPER"/"HANDLER" - Separação de lógica -----| */

   // Paginação - mudança de página
   const handlePageChange = (newPage: number) => { setCurrentPage(newPage); }
   
   // Duplo-click e edição de dados
   const handleRowDoubleClick = (index: number) => {
      const rowData = data[index]; // dados correspondentes à linha onde o ID é clickado
      setSelectedRowData(rowData);
      //console.log(rowData.DateTime); // testar objeto
      open();
   };





   /* |----- JSX / GERAR ELEMENTO -----| */


   return (    
      <div className="bg-gray-100 FIXContainer" >    
         {/* Drawer para formulário / edição de dados */}
         <Drawer 
            opened={opened} 
            onClose={close} 
            padding="md" 
            size="xl" 
            position='right' 
            withCloseButton={false}>
            {selectedRowData && (
               selectedRowData.IntExt === "2" ? 
               <NRExternaForm initialData={selectedRowData} /> : 
               <NRInternaForm initialData={selectedRowData} />
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
                  <Flex className="flex-col mb-1 px-4 pb-4 FIXContainer">
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
                        data={data} 
                        headers={headers} 
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