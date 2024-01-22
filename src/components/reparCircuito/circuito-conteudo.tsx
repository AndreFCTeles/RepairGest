/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect } from 'react';
import { Pagination, Flex, Center, Fieldset } from '@mantine/core';

// Componentes
import fetchData from '../../api/fetchData';
import GerarTabelaReparCir from './circuito-tabela';




/* |----- COMPONENTE -----| */

const ReparCirConteudo:React.FC = () => {   

   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   // Estados da tabela
   const [data, setData] = useState<any[]>([]);
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);




   /* |----- GESTÃO DE ESTADOS -----| */

   // Buscar dados e atualizar tabela
   useEffect(() => {
      const fetchDataAndUpdateState = async () => {
         try {
            setIsLoading(true);
            const fetchedData = await fetchData('getcircuitos', currentPage, 30);

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

   // Paginação - mudança de página
   const handlePageChange = (newPage: number) => { setCurrentPage(newPage); }
   
   



   /* |----- JSX / GERAR ELEMENTO -----| */


   return (    
      <div className="bg-gray-100 FIXContainer" >    
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
                  <Flex className="flex-col mb-1 px-4 pb-4 FIXContainer" justify={totalPages <= 1 ? 'center' : ''}>
                     
                     {totalPages <= 1 ? null : (
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
                     )}
                     <GerarTabelaReparCir 
                        data={data} 
                        headers={headers} 
                     />  
                  </Flex>
               )}
            </Fieldset>
         </Flex>
      </div>
   );
};

export default ReparCirConteudo;