import React, { useRef, useState, useEffect } from 'react';
import { Pagination, Text, Flex, Center, Fieldset, Radio, Autocomplete, ScrollArea } from '@mantine/core';
import fetchData from '../../api/fetchData';
import GerarTabelaCli from './tabela-clientes';

const ClientesConteudo: React.FC = () => {
    // Estado para cache e uso de dados
   const [clientList, setClientList] = useState<any[]>([]);
   const [repairListCache, setRepairListCache] = useState<any[]>([]);
   const [selectedClient, setSelectedClient] = useState<string>('');
   const [filteredRepairs, setFilteredRepairs] = useState<any[]>([]);

   // Estados da tabela
   const [data, setData] = useState<any[]>([]);
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);
   const radioGroupRef = useRef<HTMLDivElement | null>(null);
   const scrollAreaRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      const fetchClientsAndRepairs = async () => {
         setIsLoading(true);
         try {
               const clients = await fetchData('clientes'); // Fetch all clients
               const repairs = await fetchData('repar', 1, 30); // Initial fetch for repairs

               setClientList(clients.data);
               setRepairListCache(repairs.data);
               setData(repairs.data);
               setTotalPages(repairs.totalPages);

               // Set headers dynamically from the keys of the first item in the repair list
               if (repairs.data.length > 0) {
                  setHeaders(Object.keys(repairs.data[0]));
               }
         } catch (error) {
               console.error('Erro ao buscar dados - Aplicação:', error);
         } finally {
               setIsLoading(false);
         }
      };
      fetchClientsAndRepairs();
   }, []);

   useEffect(() => {
      // Logic for filtering repairs based on the selected client
      const filtered = selectedClient
         ? repairListCache.filter(repair => (repair.Cliente?.toLowerCase() || '').includes(selectedClient.toLowerCase()))
         : repairListCache;

      setFilteredRepairs(filtered);

      const startIndex = (currentPage - 1) * 30;
      const endIndex = startIndex + 30;
      setData(filteredRepairs.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(filteredRepairs.length / 30));
      
      // Ajusta tamanhos da lista dinamicamente
      const radioGroupParent = radioGroupRef.current?.parentElement;
      const scrollAreaParent = scrollAreaRef.current?.parentElement;
      if (radioGroupParent && scrollAreaParent) {
         const procuraClienteHeight = radioGroupParent.querySelector('.procuraCliente')?.clientHeight || 0;
         const clientesListaTituloHeight = radioGroupParent.querySelector('.clientesListaTitulo')?.clientHeight || 0;

         const availableHeight = Math.min(
            radioGroupParent.clientHeight, scrollAreaParent.clientHeight) - 
            (procuraClienteHeight + clientesListaTituloHeight);

         // Set height to availableHeight or 100% if availableHeight is negative
         const finalHeight = availableHeight > 0 ? `${availableHeight}px` : '100%';

         radioGroupRef.current!.style.height = finalHeight;
         scrollAreaRef.current!.style.height = finalHeight;
      }

   }, [selectedClient, repairListCache, currentPage]);

   const handlePageChange = (newPage: number) => { setCurrentPage(newPage); }

   return (  
      <div className="bg-gray-100 FIXContainer" >    
         <Flex
         justify="left"
         direction="row"
         className='p-1 FIXContainer'
         >

            {/* Campo de pesquisa */}            
            <Fieldset className='min-w-64 h-full flex flex-col'>
               <Text className='font-bold clientesListaTitulo' size="xl">Clientes</Text>
               <Radio.Group 
               name="clientes" 
               onChange={value => setSelectedClient(value)}
               className='pt-2 flex flex-col flex-1 h-full FIXContainer'
               ref={radioGroupRef}
               >
                  <Autocomplete
                  className="procuraCliente"
                  placeholder="Procurar"
                  value={selectedClient}
                  onChange={setSelectedClient}
                  data={clientList.map(client => client.Nome)}
                  dropdownOpened={false}
                  />
                  <ScrollArea className='flex-1 pt-3' ref={scrollAreaRef}>
                     {clientList
                        .filter(client => client.Nome.toLowerCase().includes(selectedClient.toLowerCase()))
                        .map(client => (
                              <Radio key={client.ID} value={client.Nome} label={client.Nome}/>
                        ))
                     }           
                  </ScrollArea>
               </Radio.Group>
            </Fieldset>

            {/* Tabela */}
            <Fieldset className='h-full flex-1 ml-1 px-2 FIXContainer'>
               {isLoading ? (
                  // Display a loading spinner or message while data is being fetched
                  // <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                  <div>Shit's loading, yo</div>
               ) : (
                  <Flex className="flex-col px-1 pb-4 FIXContainer">
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
                     <GerarTabelaCli 
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

export default ClientesConteudo;