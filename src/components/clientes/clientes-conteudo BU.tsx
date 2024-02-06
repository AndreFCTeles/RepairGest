/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useRef, useState, useEffect } from 'react';
import { Pagination, Button, Text, Flex, Center, Fieldset, Radio, Autocomplete, ScrollArea, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Componentes
import GerarTabelaCli from './clientes-tabela';
import NRInternaForm from '../reparMaquina/Interna/interna-form';
import NRExternaForm from '../reparMaquina/Externa/externa-form';

// Utils
import fetchData from '../../api/fetchData';

// Inicialização do tipo de formulário para edição de dados
interface SelectedRowData { IntExt?: string; }





/* |----- COMPONENTE -----| */

const ClientesConteudo: React.FC = () => {

   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   // Estados da tabela
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // Estado para cache e uso de dados
   const [data, setData] = useState<any[]>([]);
   const [clientList, setClientList] = useState<any[]>([]);
   const [allRepairsCache, setAllRepairsCache] = useState<any[]>([]);
   const [filteredRepairsCache, setFilteredRepairsCache] = useState<any[]>([]);
   const [selectedClient, setSelectedClient] = useState<string>('');
   const [sortField, setSortField] = useState<string | null>(null);
   const [sortOrder, setSortOrder] = useState('asc');

   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);
   const [autocompleteFilter, setAutocompleteFilter] = useState('');
   const [opened, { open, close }] = useDisclosure(false);
   const [selectedRowData, setSelectedRowData] = useState<SelectedRowData | null>(null);
   const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

   // Toggle para edição de dados
   const [isFormEditable, setIsFormEditable] = useState(false);
   const toggleFormEditability = () => { setIsFormEditable(current => !current); };

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

         const totalDeductions = procuraClienteHeight + clientesListaTituloHeight + 32; // Adicionar margens ou padding (24)
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

   // Seleção de rows
   const handleRowClick = (index: number) => {
      if (selectedRowIndex === index) { setSelectedRowIndex(null); } 
      else { setSelectedRowIndex(index); }
   };
   
   // Duplo-click e edição de dados
   const handleRowDoubleClick = (index: number) => {
      const rowData = data[index]; // dados correspondentes à linha onde o ID é clickado
      setSelectedRowData(rowData);
      setSelectedRowIndex(index);
      //console.log(rowData.DateTime); // testar objeto
      open();
   };

   // Ordenar dados
   const sortData = (field: string) => {
      const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
      const unsortedData = data;
      const sortedData = unsortedData.sort((a, b) => compareValues(a, b, field, order));
      setSortOrder(order);
      setSortField(field);
      setFilteredRepairsCache(sortedData);
   };

   // "Limpar" seleções
   const handleReset = () => {
      setAutocompleteFilter('');
      setSelectedClient('');
      const filteredRepairs = allRepairsCache.filter(repair => repair.Cliente);
      setFilteredRepairsCache(filteredRepairs);
      updateTableData(filteredRepairs, 1);
      setCurrentPage(1);
   }   

   // Reset à ordem/aos dados
   const resetData = () => {
      setFilteredRepairsCache(data);
      setSortField(null);
      setSortOrder('asc');
   };

   // Handler para guardar dados alterados
   const handleFormSave = () => {
      // 
   };





   /* |----- GESTÃO DE ESTADOS -----| */

   // Buscar dados e atualizar tabela
   useEffect(() => {
      const fetchClientsAndRepairs = async () => {
         setIsLoading(true);
         try {
            const clienteRes = await fetchData('getdata','tblClientes');
            const reparRes = await fetchData('getdata','tblRepairList');
            const reparClienteDados = reparRes.data.filter((repair: any) => repair.Cliente);
            if (reparClienteDados.length > 0) { setHeaders(Object.keys(reparClienteDados[0])); }
            setAllRepairsCache(reparRes.data);
            setFilteredRepairsCache(reparClienteDados);
            setClientList(clienteRes.data);
            updateTableData(reparClienteDados, 1);
         } catch (error) {
            console.error('Erro ao buscar e atualizar dados - Aplicação:', error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchClientsAndRepairs();
      adjustListSize();  
      return () => {}; // cleanup
   }, []);

   // Repõe "disabled" nos elementos de formulário quando Drawer é fechado
   useEffect(() => { if (!opened) { setIsFormEditable(false); } }, [opened]);

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

            {/* Campo de pesquisa */}            
            <Fieldset w={'300px'} className='h-full flex flex-col'>
               <Flex direction='row' align='center' justify='space-between'>
                  <Text className='font-bold clientesListaTitulo' size="xl">Clientes</Text>
                  <Button 
                  onClick={handleReset} 
                  className='normalBtn' 
                  w={100}>Apagar</Button>
               </Flex>
               <Radio.Group 
               name="clientes" 
               className='pt-2 flex flex-col flex-1 h-full FIXContainer'
               onChange={handleRadioChange}
               ref={radioGroupRef}
               value={selectedClient}
               >
                  <Autocomplete
                  className="procuraCliente"
                  placeholder="Procurar"
                  dropdownOpened={false}
                  value={autocompleteFilter}
                  onChange={handleAutocompleteChange}
                  data={clientList.map(client => client.Nome)}
                  />
                  <ScrollArea className='flex-1 pt-3 pb-2' ref={scrollAreaRef}>
                     {clientList
                        .filter(client => client.Nome.toLowerCase().includes(autocompleteFilter))
                        .map(client => (
                           <Radio 
                           key={client.ID} 
                           value={client.Nome} 
                           label={client.Nome}
                           checked={selectedClient === client.Nome}
                           onChange={()=> handleRadioChange(client.Nome)}
                           className='p-1'
                           styles={{
                              inner: {
                                 display: 'flex',
                                 marginLeft: 8, 
                                 alignItems: 'center'
                              },
                              icon:{                                 
                                 display: 'none'
                              }
                           }}
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
                        siblings={2}
                        boundaries={1}
                        withEdges
                        className='m-1'
                        />
                     </Center>
                     <GerarTabelaCli 
                     data={data} 
                     headers={headers} 
                     onHeaderClick={sortData}
                     resetData={resetData}
                     onRowDoubleClick={handleRowDoubleClick}
                     onRowClick={handleRowClick}
                     selectedRowIndex={selectedRowIndex}
                     />  
                  </Flex>
               )}
            </Fieldset>

         </Flex>
      </div>
   );
};

export default ClientesConteudo;