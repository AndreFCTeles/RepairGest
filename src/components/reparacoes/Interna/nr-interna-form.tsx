/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect, useRef } from 'react';
import { Text, Stack, Flex, TextInput, Textarea, Checkbox, Box, Select, Fieldset, Autocomplete, ScrollArea, SegmentedControl } from '@mantine/core';
import { DatePickerInput , DatesProvider} from '@mantine/dates'

// Componentes
import fetchData from '../../../api/fetchData';
import 'dayjs/locale/pt'; // Implementa calendário e formatação de data - Portugal




/* |----- COMPONENTE -----| */

const NRInternaForm: React.FC = () => {

   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   
   // Estado para cache e uso de dados
   const [clientList, setClientList] = useState<any[]>([]);
   const [allRepairsCache, setAllRepairsCache] = useState<any[]>([]);
   const [filteredRepairsCache, setFilteredRepairsCache] = useState<any[]>([]);
   // inicialização de valores para garantias e acessórios
   const [valorGar, setValorGar] = useState('nao');
   const [valorAcc, setValorAcc] = useState('nao');

   // inicialização da data
   const [dataCalendario, setDataCalendario] = useState<Date | null>(null);

   // inicialização de lista de Avarias
   const [avariasList, setAvariasList] = useState<any[]>([]);

   // New state and ref for Autocomplete and dynamic sizing
   const [autocompleteFilter, setAutocompleteFilter] = useState('');
   const scrollAreaRef = useRef<HTMLDivElement | null>(null);

   // New function for handling autocomplete changes
   const handleAutocompleteChange = (value: string) => { setAutocompleteFilter(value.toLowerCase()); };

   



   /* |----- FUNÇÕES "HELPER" - Separação de lógica -----| */

   // Function to adjust the size of ScrollArea dynamically
   const adjustListSize = () => {
      const scrollAreaParent = scrollAreaRef.current?.parentElement;
      if (scrollAreaParent) {
         const otherElementsHeight = 24; // Adjust this value based on other elements' height
         const availableHeight = scrollAreaParent.clientHeight - otherElementsHeight;
         const finalHeight = availableHeight > 0 ? `${availableHeight}px` : '100%';
         scrollAreaRef.current!.style.height = finalHeight;
      }
   };




   /* |----- GESTÃO DE ESTADOS -----| */

   useEffect(() => {
      const fetchAvarias = async () => {
         try {
            const avarias = await fetchData('getavarias'); // Fetch data from tblAvarias.json
            setAvariasList(avarias.data);
         } catch (error) {
            console.error('Erro ao buscar dados - Aplicação:', error);
         }
      };
      fetchAvarias();
      adjustListSize();
   }, []);

   // useEffect to handle window resize for dynamic sizing
   useEffect(() => {
      const resizeObserver = new ResizeObserver(() => { adjustListSize(); });
      if (scrollAreaRef.current) { resizeObserver.observe(scrollAreaRef.current); }
      return () => { if (scrollAreaRef.current) { resizeObserver.unobserve(scrollAreaRef.current); } };
   }, []);
   
   



   /* |----- JSX / GERAR ELEMENTO -----| */

   return (
      <div className='p-5 h-full'>         
         <Text className='font-bold' size="xl">Reparação Interna</Text>
               
         <Box mx="auto"><form className='h-full'>{/*onSubmit=handleSubmit*/}

               <Flex
               justify="center"
               align="center"
               direction="row"
               wrap="wrap">
                  <Fieldset legend="Detalhes" className='lg-w-1/2'>  
                     <Box className="w-1/2 mb-4">
                        <DatesProvider settings={{locale: 'pt', firstDayOfWeek: 0}}>
                           <DatePickerInput
                              label="Data"
                              value={dataCalendario}
                              onChange={setDataCalendario}
                              valueFormat='DD MMM YYYY'
                           />
                        </DatesProvider>
                     </Box>
                     
                     
                     <Flex
                     justify="center"
                     align="center"
                     direction="row"
                     wrap="wrap"
                     gap="xs">
                        <TextInput
                        label="Ordem de Reparação"
                        placeholder="auto-gerar num"
                        value={Math.floor(Math.random()*10000)}
                        disabled
                        />
                        <TextInput
                        label="Número de série"
                        placeholder="auto-gerar num"
                        value={Math.floor(Math.random()*10000)}
                        disabled
                        />
                     </Flex>

                     <Flex
                     justify="center"
                     align="center"
                     direction="row"
                     wrap="wrap"
                     gap="xs">
                        <Select
                        label="Cliente"
                        data={['Castolin', 'Maquet Soudage', 'Morais & Câmara, Lda.', 'Gasidouro', 'Rexoldas', 'Gomes & Branco']}
                        allowDeselect
                        />
                        <Select
                        label="Marca"
                        data={['Electrex', 'Castolin', 'Lincoln', 'Maquet Soudage', 'EWM']}
                        allowDeselect
                        withScrollArea
                        />
                     </Flex>

                     <Flex
                     className='mb-5'
                     justify="center"
                     align="center"
                     direction="row"
                     wrap="wrap"
                     gap="xs">
                        <Select
                        label="Modelo"
                        data={['TIG200', 'MIG600', 'DC203', 'TP252', 'ACDC304']}
                        allowDeselect
                        withScrollArea
                        />
                        <Select
                        label="Tipo de Máquina"
                        data={['Alimentador', 'Inverter', 'MIG', 'Pontos', 'Refrigerador']}
                        allowDeselect
                        />
                     </Flex>

                     <Flex
                     justify="center"
                     align="center"
                     direction="row"
                     wrap="wrap"
                     gap="xs">
                        <Fieldset legend="Garantia" className='p-2'>
                           <SegmentedControl 
                           value={valorGar}
                           onChange={setValorGar}
                           data={[
                              {label:'Sim', value:'sim'},
                              {label:'Não', value:'nao'}
                           ]} />
                        </Fieldset>
                        <Fieldset legend="Acessórios" className='p-2'>
                           <SegmentedControl 
                           value={valorAcc}
                           onChange={setValorAcc}
                           data={[
                              {label:'Sim', value:'sim'},
                              {label:'Não', value:'nao'}
                           ]} />
                        </Fieldset>
                     </Flex>

                     <Textarea
                     size="md"
                     label="Observações"
                     placeholder=""
                     />
                  </Fieldset>

                  <Fieldset 
                  legend="Defeitos"  
                  w={'300px'} 
                  className='h-full flex flex-col'
                  >
                     <Stack>
                        <Autocomplete
                        className="procuraAvaria"
                        placeholder="Procurar"
                        value={autocompleteFilter}
                        onChange={handleAutocompleteChange}
                        data={avariasList.map((avaria) => avaria.Avaria)}
                        dropdownOpened={false} />
                        <ScrollArea className='flex-1 pt-3' ref={scrollAreaRef}>
                           {avariasList
                              .filter(avaria => avaria.Avaria.toLowerCase().includes(autocompleteFilter))
                              .map((avaria) => (
                                 <Checkbox 
                                 className="avaria-item px-1" 
                                 key={avaria.ID} 
                                 value={avaria.Avaria} 
                                 label={avaria.Avaria} 
                                 />
                              ))
                           }
                        </ScrollArea> 
                     </Stack>
                  </Fieldset>
               </Flex>

                           
         </form></Box>      
      </div>
   );
}

export default NRInternaForm;