/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect } from 'react';
import { Button, Pagination, Flex, Center, Fieldset, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Componentes
import GerarTabelaReparCir from './circuito-tabela';
import NRCircuitoForm from './circuito-form';

// Utils
import fetchData from '../../api/fetchData';

// Inicialização do tipo de formulário para edição de dados
interface SelectedRowData { IntExt?: string; }





/* |----- COMPONENTE -----| */

const ReparCirConteudo:React.FC = () => {   

   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   // Estados da tabela
   const [headers, setHeaders] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // Estados de cache/sorting
   const [data, setData] = useState<any[]>([]);
   const [sortField, setSortField] = useState<string>('DataTime');
   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


   // Estados/Funcionalidade da aplicação
   const [isLoading, setIsLoading] = useState(false);
   const [opened, { open, close }] = useDisclosure(false);
   const [selectedRowData, setSelectedRowData] = useState<SelectedRowData | null>(null);
   const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

   // Toggle para edição de dados
   const [isFormEditable, setIsFormEditable] = useState(false);





   /* |----- FUNÇÕES "HELPER"/"HANDLER" - Separação de lógica -----| */

   // Buscar dados e atualizar tabela
   const fetchDataAndUpdateState = async (
      page: number = currentPage, 
      field: string = sortField, 
      order: 'asc' | 'desc' = sortOrder
   ) => {
      setIsLoading(true);
      try {
         const result = await fetchData('getpagdata', 'tblCircuitoList', page, 30, field, order);
         setData(result.data);
         setTotalPages(result.totalPages);
         setCurrentPage(result.currentPage);

         if (result.data.length > 0) { setHeaders(Object.keys(result.data[0])); }
      } catch (error) { console.error('Error fetching data:', error); } 
      finally { setIsLoading(false); }
   };

   // Toggle para edição de dados
   const toggleFormEditability = () => { setIsFormEditable(current => !current); };

   // Paginação - mudança de página
   const handlePageChange = (newPage: number) => { 
      setCurrentPage(newPage);
      fetchDataAndUpdateState(newPage); 
   }
   
   // Seleção de rows
   const handleRowClick = (index: number) => { setSelectedRowIndex(selectedRowIndex === index ? null : index); };
   
   // Duplo-click e edição de dados
   const handleRowDoubleClick = (index: number) => {
      setSelectedRowData(data[index]); // dados correspondentes à linha onde o ID é clickado
      setSelectedRowIndex(index);
      //console.log(rowData.DateTime); // testar objeto
      open();
   };

   // Ordenar dados
   const sortData = (field: string) => {
      const order = sortField === field && sortOrder === 'desc' ? 'asc' : 'desc';
      setSortOrder(order);
      setSortField(field);
      fetchDataAndUpdateState(currentPage, field, order);
   };

   // Reset à ordem/aos dados
   const resetData = () => {
      setSortField('DataTime');
      setSortOrder('desc');
   };

   // Handler para guardar dados alterados
   const handleFormSave = () => { };





   /* |----- GESTÃO DE ESTADOS -----| */

   // Buscar dados e atualizar tabela
   useEffect(()=>{ fetchDataAndUpdateState(1) }, [])

   // Repõe "disabled" nos elementos de formulário quando Drawer é fechado
   useEffect(() => { if (!opened) { setIsFormEditable(false); } }, [opened]);





   /* |----- JSX / GERAR ELEMENTO -----| */

   return (    
      <div className="bg-gray-100 FIXContainer" >    
         {/* Drawer para formulário / edição de dados */}
         <Drawer 
         opened={opened} 
         onClose={()=>{
            setIsFormEditable(false);
            setSelectedRowIndex(null);
            close();
         }} 
         padding="md" 
         size="xl" 
         position='right' 
         withCloseButton={true}>
            <Flex direction='row' justify='center'>
               <Button className='normalBtn' onClick={toggleFormEditability}>
                  {isFormEditable ? "Cancelar" : "Editar"}
               </Button>
               <Button className='normalBtn' onClick={handleFormSave}>
                  Guardar
               </Button>
            </Flex>
            <NRCircuitoForm initialData={selectedRowData} isEditable={isFormEditable} /> 
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
                  /*align={totalPages <= 1 ? 'center' : ''}*/
                  justify={totalPages <= 1 ? 'bottom' : ''}
                  >
                     
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
                     onHeaderClick={sortData}
                     sortField={sortField}
                     sortOrder={sortOrder}
                     onRowDoubleClick={handleRowDoubleClick}
                     onRowClick={handleRowClick}
                     selectedRowIndex={selectedRowIndex}
                     resetData={resetData}
                     />  
                  </Flex>
               )}
            </Fieldset>
         </Flex>
      </div>
   );
};

export default ReparCirConteudo;