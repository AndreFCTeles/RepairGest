import React, { useRef, useState, useEffect } from 'react';
import { Pagination, Text, Flex, Center, Fieldset, Radio, Autocomplete, ScrollArea } from '@mantine/core';
import fetchData from '../../api/fetchData';
import GerarTabelaCli from './tabela-clientes';

const ClientesConteudo: React.FC = () => {
   // Estado para cache e uso de dados
   const [clientList, setClientList] = useState<any[]>([]);
   const [allRepairsCache, setAllRepairsCache] = useState<any[]>([]);
   const [filteredRepairsCache, setFilteredRepairsCache] = useState<any[]>([]);
   const [selectedClient, setSelectedClient] = useState<string>('');

   // Estados da tabela
   const [data, setData] = useState<any[]>([]);
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);

   // Dimensionamento dinâmico de elementos
   const radioGroupRef = useRef<HTMLDivElement | null>(null);
   const scrollAreaRef = useRef<HTMLDivElement | null>(null);

   // Função que refresca dados da tabela
   const updateTableData = (repairs: any[], page: number) => {
      const pageSize = 30; // Declara o numero de items por página
      const startIndex = (page - 1) * pageSize; // Declara o tamanho de cada página
      const endIndex = startIndex + pageSize;
      setData(repairs.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(repairs.length / pageSize));
   };

   useEffect(() => {
      const fetchClientsAndRepairs = async () => {
         setIsLoading(true);
         try {
            const clientsResponse = await fetchData('clientes');
            const repairsResponse = await fetchData('repar');

            setAllRepairsCache(repairsResponse.data);
            const repairsWithClient = repairsResponse.data.filter((repair: any) => repair.Cliente);
            setFilteredRepairsCache(repairsWithClient);

            setClientList(clientsResponse.data);
            if (repairsWithClient.length > 0) {
               setHeaders(Object.keys(repairsWithClient[0]));
            }

            updateTableData(repairsWithClient, 1);
         } catch (error) {
            console.error('Error fetching data:', error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchClientsAndRepairs();
   }, []);

   useEffect(() => {
      let newFilteredRepairs;
      if (selectedClient) {
      // Filtrar dados de reparação consoante o cliente selecionado e refrescar tabela
      // When a new Cliente is selected, filter from allRepairsCache
         newFilteredRepairs = allRepairsCache
            .filter((repair: any) => repair.Cliente && repair.Cliente.toLowerCase() === selectedClient.toLowerCase());
      } else {
         // If no Cliente is selected, use the initial filtered cache
         newFilteredRepairs = filteredRepairsCache;
      }
      setFilteredRepairsCache(newFilteredRepairs);
      updateTableData(newFilteredRepairs, 1); // Always revert to page 1 on filter change
      setCurrentPage(1);
      
      // Ajusta tamanhos da lista dinamicamente
      const radioGroupParent = radioGroupRef.current?.parentElement;
      const scrollAreaParent = scrollAreaRef.current?.parentElement;
      if (radioGroupParent && scrollAreaParent) {
         const procuraClienteHeight = radioGroupParent.querySelector('.procuraCliente')?.clientHeight || 0;
         const clientesListaTituloHeight = radioGroupParent.querySelector('.clientesListaTitulo')?.clientHeight || 0;

         const availableHeight = Math.min(
            radioGroupParent.clientHeight, scrollAreaParent.clientHeight) - 
            (procuraClienteHeight + clientesListaTituloHeight);

         // Determina espaço existente para tamanho dinâmico da lista de clientes
         const finalHeight = availableHeight > 0 ? `${availableHeight-20}px` : '100%';

         radioGroupRef.current!.style.height = finalHeight;
         scrollAreaRef.current!.style.height = finalHeight;
      }

   }, [selectedClient, allRepairsCache]);

   const handlePageChange = (newPage: number) => { 
      setCurrentPage(newPage); 
      updateTableData(filteredRepairsCache, newPage);
   }

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