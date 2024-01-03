import React, { useState, useEffect } from 'react';
import {fetchData, fetchTotalCount} from '../../api/fetchData';
import GerarTabela from '../partilhado/tabela';
import { Pagination, ScrollArea, Stack } from '@mantine/core';

const ReparConteudo:React.FC = () => {
   const [data, setData] = useState<any[]>([]);
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalItems, setTotalItems] = useState(0);

   useEffect(() => {
      const fetchDataAndUpdateState = async () => {
         try {
            const fetchedData = await fetchData(currentPage, 30);

            if (fetchedData.length > 0) {
               const primeiroItem = fetchedData[0];
               const headerKeys = Object.keys(primeiroItem);
               setHeaders(headerKeys);
            }
            setData(fetchedData);
         } catch (error) {
            console.error('Erro ao buscar e atualizar dados:', error);
         }         
      }
      const fetchTotalItems = async () => {
         try {
            const totalCount = await fetchTotalCount();
            setTotalItems(totalCount);
         } catch (error) {
            console.error('Error fetching total items count:', error);
         }
      }
      fetchDataAndUpdateState();
      fetchTotalItems();
      // cleanup
      return () => {};
   }, [currentPage]);

   const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
   }

   return (    
      <div className="flex bg-gray-100">    
         <ScrollArea>
            <Pagination
               total={totalItems}
               page={currentPage}
               onPageChange={handlePageChange}
            />
            <GerarTabela data={data} headers={headers} />
         </ScrollArea>         
      </div>
   );
};

export default ReparConteudo;