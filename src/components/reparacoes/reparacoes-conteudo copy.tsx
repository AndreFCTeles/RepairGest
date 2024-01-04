import React, { useState, useEffect } from 'react';
import fetchData from '../../api/fetchData';
import GerarTabela from '../partilhado/tabela';
import { Pagination, Stack } from '@mantine/core';

const ReparConteudo:React.FC = () => {
   const [data, setData] = useState<any[]>([]);
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalItems, setTotalItems] = useState(0);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const fetchDataAndUpdateState = async () => {
         try {
            setIsLoading(true); // Set loading state to true
            const {data: fetchedData, totalCount} = await fetchData(currentPage, 30);

            if (fetchedData.length > 0) {
               const primeiroItem = fetchedData[0];
               const headerKeys = Object.keys(primeiroItem);
               setHeaders(headerKeys);
            }
            setData(fetchedData);
            setTotalItems(totalCount);
         } catch (error) {
            console.error('Erro ao buscar e atualizar dados:', error);
         } finally {
            setIsLoading(false); // Set loading state to false after fetching is done
         }
      }
      fetchDataAndUpdateState();

      return () => {}; // cleanup
   }, [currentPage]);

   const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
   }

   return (    
      <div className="flex bg-gray-100">    
         <Stack>
            {isLoading ? (
               // Display a loading spinner or message while data is being fetched
               <div>Shit's loading yo</div>
            ) : (
               <>
                  <Pagination
                     total={totalItems}
                     value={currentPage}
                     onChange={handlePageChange}
                     withEdges
                  />
                  <GerarTabela data={data} headers={headers} currentPage={currentPage} itemsPerPage={30} />
               </>
            )}
         </Stack>
      </div>
   );
};

export default ReparConteudo;