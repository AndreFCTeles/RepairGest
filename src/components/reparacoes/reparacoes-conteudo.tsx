import React, { useState, useEffect } from 'react';
import { Pagination, Flex, Center } from '@mantine/core';
import fetchData from '../../api/fetchData';
import GerarTabelaRepar from './tabela-reparacoes';

const ReparConteudo:React.FC = () => {
   // Estados da tabela
   const [data, setData] = useState<any[]>([]);
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const fetchDataAndUpdateState = async () => {
         try {
            setIsLoading(true);
            const fetchedData = await fetchData('repar', currentPage, 30);

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
   const handlePageChange = (newPage: number) => { setCurrentPage(newPage); }

   return (    
      <div className="bg-gray-100 FIXContainer" >    
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
               <GerarTabelaRepar 
                  data={data} 
                  headers={headers} 
               />  
            </Flex>
         )}
      </div>
   );
};

export default ReparConteudo;