/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useRef, useState, useEffect } from 'react';
import { Pagination, Text, Flex, Center, Fieldset, Radio, Autocomplete, ScrollArea } from '@mantine/core';

// Componentes
import fetchData from '../../api/fetchData';
import GerarTabelaCli from './tabela-clientes';





/* |----- COMPONENTE -----| */

const ClientesConteudo: React.FC = () => {

   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

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
   const [autocompleteFilter, setAutocompleteFilter] = useState('');

   // Dimensionamento dinâmico de elementos
   const radioGroupRef = useRef<HTMLDivElement | null>(null);
   const scrollAreaRef = useRef<HTMLDivElement | null>(null);





   /* |----- FUNÇÕES "HELPER" - Separação de lógica -----| */

   // Refrescamento de dados da tabela
   const updateTableData = (repairs: any[], page: number) => {
      const pageSize = 30; // Declara o numero de items por página
      const startIndex = (page - 1) * pageSize; // Declara o tamanho de cada página
      const endIndex = startIndex + pageSize;
      setData(repairs.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(repairs.length / pageSize));
   };

   // Dimensionamento de lista de clientes
   const adjustListSize = () => {
      const radioGroupParent = radioGroupRef.current?.parentElement;
      const scrollAreaParent = scrollAreaRef.current?.parentElement;
      if (radioGroupParent && scrollAreaParent) {
         const procuraClienteHeight = radioGroupParent.querySelector('.procuraCliente')?.clientHeight || 0;
         const clientesListaTituloHeight = radioGroupParent.querySelector('.clientesListaTitulo')?.clientHeight || 0;

         const totalDeductions = procuraClienteHeight + clientesListaTituloHeight + 24; // Adicionar margens ou padding (24)
         const availableHeight = radioGroupParent.clientHeight - totalDeductions;

         const finalHeight = availableHeight > 0 ? `${availableHeight}px` : '100%';
         radioGroupRef.current!.style.height = finalHeight;
         scrollAreaRef.current!.style.height = finalHeight;
      }
   };

   // Gestão da filtragem da lista de clientes 
   const handleAutocompleteChange = (value: string) => { setAutocompleteFilter(value.toLowerCase()); };
   const handleRadioChange = (value: string) => { setSelectedClient(value); };

   // Paginação - mudança de página
   const handlePageChange = (newPage: number) => { 
      setCurrentPage(newPage); 
      updateTableData(filteredRepairsCache, newPage);
   };





   /* |----- GESTÃO DE ESTADOS -----| */

   // Buscar dados e atualizar tabela
   useEffect(() => {
      const fetchClientsAndRepairs = async () => {
         setIsLoading(true);
         try {
            const clienteRes = await fetchData('getclientes');
            const reparRes = await fetchData('getrepar');
            const reparClienteDados = reparRes.data.filter((repair: any) => repair.Cliente);
            if (reparClienteDados.length > 0) { setHeaders(Object.keys(reparClienteDados[0])); }
            setAllRepairsCache(reparRes.data);
            setFilteredRepairsCache(reparClienteDados);
            setClientList(clienteRes.data);
            updateTableData(reparClienteDados, 1);
         } catch (error) {
            console.error('Error fetching data:', error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchClientsAndRepairs();
      adjustListSize();
   }, []);


   // Filtragem dinâmica de dados
   useEffect(() => {
      // Filtrar dados de reparação consoante o cliente selecionado e refrescar tabela
      let newFilteredRepairs = selectedClient      
         ? allRepairsCache.filter((repair: any) => repair.Cliente && repair.Cliente.toLowerCase() === selectedClient.toLowerCase())
         : filteredRepairsCache; // Se nenhum cliente for selecionado, usar a cache de dados filtrados inicial
      // Atualizar estados
      setFilteredRepairsCache(newFilteredRepairs);
      updateTableData(newFilteredRepairs, 1); // Reverter para página 1 mudando de filtragem
      setCurrentPage(1);
   }, [selectedClient, allRepairsCache]);
   

   // Lógica para dimensionamento caso a janela mude de tamanho
   useEffect(() => {
      const resizeObserver = new ResizeObserver(() => { adjustListSize(); });
      if (radioGroupRef.current) { resizeObserver.observe(radioGroupRef.current); }
      return () => { if (radioGroupRef.current) { resizeObserver.unobserve(radioGroupRef.current); } };
   }, []);





   /* |----- JSX / GERAR ELEMENTO -----| */

   return (  
      <div className="bg-gray-100 FIXContainer" >    
         <Flex
         justify="left"
         direction="row"
         className='p-1 FIXContainer'
         >

            {/* Campo de pesquisa */}            
            <Fieldset w={'300px'} className='h-full flex flex-col'>
               <Text className='font-bold clientesListaTitulo' size="xl">Clientes</Text>
               <Radio.Group 
               name="clientes" 
               className='pt-2 flex flex-col flex-1 h-full FIXContainer'
               onChange={handleRadioChange}
               ref={radioGroupRef}
               >
                  <Autocomplete
                  className="procuraCliente"
                  placeholder="Procurar"
                  dropdownOpened={false}
                  value={autocompleteFilter}
                  onChange={handleAutocompleteChange}
                  data={clientList.map(client => client.Nome)}
                  />
                  <ScrollArea className='flex-1 pt-3' ref={scrollAreaRef}>
                     {clientList
                        .filter(client => client.Nome.toLowerCase().includes(autocompleteFilter))
                        .map(client => (
                              <Radio 
                              key={client.ID} 
                              value={client.Nome} 
                              label={client.Nome}
                              className='p-1'
                              />                              
                        ))
                     }           
                  </ScrollArea>
               </Radio.Group>
            </Fieldset>

            {/* Tabela */}
            <Fieldset className='flex-1 px-2 FIXContainer'>
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