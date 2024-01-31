/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, ComboboxChevron, ScrollArea, Text, Flex, TextInput, Textarea, Checkbox, Box, Fieldset, SegmentedControl, Divider } from '@mantine/core';
import { DatePickerInput , DatesProvider} from '@mantine/dates'

// Componentes
import fetchData from '../../../api/fetchDataBU';
import postData from '../../../api/postData';
import 'dayjs/locale/pt';

// Tipos estruturados de valores para validação dos dados em fetch
interface Cliente { Nome: string; }
interface Maquina { Maquina: string; }
interface Modelo { ModeloElectrex: string; }
interface Tipo { Tipo: string; }
interface Avaria {
   ID: number;
   Avaria: string; 
}

// Tipos estruturados de valores para validação
interface FormValues {
   dataCalendario: Date | null;
   numeroSerie: string;
   cliente: string;
   marca: string;
   modelo: string;
   tipo: string;
   valorGar: string;
   acessorios: string;
   observacoes: string;
   defeitos: string[];
}

// Propriedades do componente
interface NRExternaFormProps {
   initialData: any;
   isEditable?: boolean;
}





/* |----- COMPONENTE -----| */

const NRExternaForm: React.FC<NRExternaFormProps> = ({initialData, isEditable=true}) => {

   /* |----- INICIALIZAÇÃO DE ESTADOS / VARIÁVEIS -----| */

   // Inicialização do formato dos dados em formulário
   const [formValues, setFormValues] = useState<FormValues>({
      dataCalendario: null,
      numeroSerie: '',
      cliente: '',
      marca: '',
      modelo: '',
      tipo: '',
      valorGar: 'nao',
      acessorios: '',
      observacoes: '',
      defeitos: [],
   });
   const [valorAcc, setValorAcc] = useState('nao');

   // transfere os dados da tabela como dados iniciais do formulário
   useEffect(() => {
      if (initialData) { 
         // console.log(initialData); // Debugging
         setFormValues({
            dataCalendario: initialData.DataTime ? new Date(initialData.DataTime) : null,
            numeroSerie: initialData.NumMaquina ? initialData.NumMaquina : '',
            cliente: initialData.Cliente ? initialData.Cliente : '',
            marca: initialData.Marca ? initialData.Marca : '',
            modelo: initialData.ModeloElectrex ? initialData.ModeloElectrex : '',
            tipo: initialData.Tipo ? initialData.Tipo : '',
            valorGar: initialData.Garantia ? initialData.Garantia : 'nao',
            acessorios: initialData.Acessorios ? initialData.Acessorios : '',
            observacoes: initialData.Observacoes ? initialData.Observacoes : '',
            defeitos: initialData.Avarias ? initialData.Avarias : [],
         });
      }
   }, [initialData]);

   // Estado para cache e uso de dados
   const [clientesCache, setClientesCache] = useState<Cliente[]>([]);
   const [maquinasCache, setMaquinasCache] = useState<Maquina[]>([]);
   const [modelosCache, setModelosCache] = useState<Modelo[]>([]);
   const [tiposCache, setTiposCache] = useState<Tipo[]>([]);
   const [avariasCache, setAvariasCache] = useState<Avaria[]>([]);


   // Estado da filtragem de defeitos
   const [autocompleteFilter, setAutocompleteFilter] = useState('');

   // Referência para dimensões dinâmicas da lista de defeitos
   const scrollAreaRef = useRef<HTMLDivElement | null>(null);





   /* |----- FUNÇÕES "HELPER"/"HANDLER" - Separação de lógica -----| */

   // Gestão de tamanhos dinâmicos de lista de defeitos
   const adjustListSize = () => {
      const scrollAreaParent = scrollAreaRef.current?.parentElement;
      if (scrollAreaParent) {
         const totalDeductions = 24+8;
         const availableHeight = scrollAreaParent.clientHeight - totalDeductions;
         const finalHeight = availableHeight > 0 ? `${availableHeight}px` : '100%';
         scrollAreaRef.current!.style.height = finalHeight;
      }
   };

   // Gestão da filtragem da lista de avarias 
   const handleAutocompleteChange = (value: string) => { setAutocompleteFilter(value.toLowerCase()); };
   
   // Handler de defeitos
   const handleDefeitoChange = (avaria: string) => {
      setFormValues(prevValues => ({
         ...prevValues,
         defeitos: prevValues.defeitos.includes(avaria) ? prevValues.defeitos.filter(d => d !== avaria) : [...prevValues.defeitos, avaria]
      }));
   };

   // Handler para TextInputs
   const handleInputChange = (field: keyof FormValues, value: any) => {
      setFormValues(prevValues => ({
         ...prevValues,
         [field]: value,
      }));
   };





   /* |----- GESTÃO DE ESTADOS -----| */

   // Busca de dados
   useEffect(() => {
      const fetchDataAndPopulateCaches = async () => {
         try {
            // Fetch Avarias
            let avariasData = avariasCache;
            if (avariasData.length === 0) {
               const res = await fetchData('getavarias');
               avariasData = res.data;
               setAvariasCache(avariasData);
               adjustListSize();
            }
            // Fetch Clientes
            let clientesData = clientesCache;
            if (clientesData.length === 0) {
               const res = await fetchData('getclientes');
               clientesData = res.data;
               setClientesCache(clientesData);
            }
            // Fetch Marcas
            let maquinasData = maquinasCache;
            if (maquinasData.length === 0) {
               const res = await fetchData('getmaquinas');
               maquinasData = res.data;
               setMaquinasCache(maquinasData);
            }
            // Fetch Modelos
            let modelosData = modelosCache;
            if (modelosData.length === 0) {
               const res = await fetchData('getmodelos');
               modelosData = res.data;
               setModelosCache(modelosData);
            }
            // Fetch Tipos
            let tiposData = tiposCache;
            if (tiposData.length === 0) {
               const res = await fetchData('gettipos');
               tiposData = res.data;
               setTiposCache(tiposData);
            }
         } catch (error) {
            console.error('Error fetching data:', error);
         }
      }; 
      fetchDataAndPopulateCaches();
}, [avariasCache, clientesCache, maquinasCache, modelosCache, tiposCache]); 

   // Inicialização da data
   useEffect(() => {
      if (!initialData) { 
         const fetchDateTime = async () => {
            try {
               const currentDateTime = await fetchData('currentDateTime');
               const dateObject = new Date(currentDateTime.dateTime);
               setFormValues(prevValues => ({
                  ...prevValues,
                  dataCalendario: dateObject
               }));
            } catch (error) {
               console.error('Erro ao buscar data/hora - Aplicação:', error);
            }
         };
         fetchDateTime();
      }
   }, []);

   // Efeito para gerir tamanhos dinâmicos
   useEffect(() => {
      const resizeObserver = new ResizeObserver(() => { adjustListSize(); });
      if (scrollAreaRef.current) { resizeObserver.observe(scrollAreaRef.current); }
      return () => { if (scrollAreaRef.current) { resizeObserver.unobserve(scrollAreaRef.current); } };
   }, []);   





   /* |----- SUBMETER DADOS -----| */

   // Handler para submissão de dados
   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      try {
         const response = await postData('novareparmaq', formValues); 
         console.log('Resposta:', response); 
      } catch (error) {
         console.error('Erro ao submeter dados:', error);
      }
      // console.log(formValues); // caso precise de testar
   };





   /* |----- JSX / GERAR ELEMENTO -----| */

   return (
      <div className='p-5 h-full'>
         <Text className='font-bold' size="xl">Reparação Externa</Text>
               
         <Box mx="auto"><form className='h-full' onSubmit={handleSubmit}>

               <Flex
               justify="center"
               align="flex-start"
               direction="row"
               wrap="wrap">
                  <Fieldset legend="Detalhes" className='lg-w-1/2'>  

                     <Box className="w-1/2 mb-4">
                        <DatesProvider settings={{locale: 'pt', firstDayOfWeek: 0}}>
                           <DatePickerInput
                           label="Data"
                           value={formValues.dataCalendario}
                           onChange={(date) => handleInputChange('dataCalendario', date)}
                           valueFormat='DD MMM YYYY'
                           pointer
                           rightSection={<ComboboxChevron className='clickThrough' />}
                           disabled={!isEditable}
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
                        placeholder=""
                        disabled
                        />
                        <TextInput
                        label="Número de série"
                        placeholder=""
                        value={formValues.numeroSerie}
                        onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                        disabled={!isEditable}
                        />
                     </Flex>

                     <Divider className='my-10' variant='dotted' />

                     <Flex
                     justify="center"
                     align="center"
                     direction="row"
                     wrap="wrap"
                     gap="xs">
                        <Autocomplete
                        label="Cliente"
                        data={clientesCache.map(cliente => cliente.Nome)}
                        value={formValues.cliente}
                        onChange={(value) => handleInputChange('cliente', value)}
                        pointer
                        rightSection={<ComboboxChevron className='clickThrough' />}
                        disabled={!isEditable}
                        />
                        <Autocomplete
                        label="Marca"
                        data={maquinasCache.map(maquina => maquina.Maquina)}
                        value={formValues.marca}
                        onChange={(value) => handleInputChange('marca', value)}
                        pointer
                        rightSection={<ComboboxChevron className='clickThrough' />}
                        disabled={!isEditable}
                        />
                     </Flex>

                     <Flex
                     className='mb-5'
                     justify="center"
                     align="center"
                     direction="row"
                     wrap="wrap"
                     gap="xs">
                        <Autocomplete
                        label="Modelo"
                        data={modelosCache.map(modelo => modelo.ModeloElectrex)}
                        value={formValues.modelo}
                        onChange={(value) => handleInputChange('modelo', value)}
                        pointer
                        rightSection={<ComboboxChevron className='clickThrough' />}
                        disabled={!isEditable}
                        />
                        <Autocomplete
                        label="Tipo de Máquina"
                        data={tiposCache.map(modelo => modelo.Tipo)}
                        value={formValues.tipo}
                        onChange={(value) => handleInputChange('tipo', value)}
                        pointer
                        rightSection={<ComboboxChevron className='clickThrough' />}
                        disabled={!isEditable}
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
                           value={formValues.valorGar}
                           onChange={(value) => handleInputChange('valorGar', value)}
                           data={[
                              {label:'Não', value:'nao'},
                              {label:'Sim', value:'sim'}
                           ]}
                           disabled={!isEditable}
                           />
                        </Fieldset>
                        <Fieldset legend="Acessórios" className='p-2'>
                           <SegmentedControl 
                           value={valorAcc}
                           onChange={setValorAcc}
                           data={[
                              {label:'Não', value:'nao'},
                              {label:'Sim', value:'sim'}
                           ]}
                           disabled={!isEditable}
                           />
                        </Fieldset>
                     </Flex>

                     { valorAcc === 'sim' && (
                        <Textarea
                        size="md"
                        label="Acessórios"
                        placeholder=""
                        value={formValues.acessorios}
                        onChange={(e) => handleInputChange('acessorios', e.target.value)}
                        disabled={!isEditable}
                        />
                     )}

                     <Textarea
                     size="md"
                     label="Observações"
                     placeholder=""
                     value={formValues.observacoes}
                     onChange={(e) => handleInputChange('observacoes', e.target.value)}
                     disabled={!isEditable}
                     />
                  </Fieldset>

                  <Fieldset 
                  legend="Defeitos"  
                  w={'300px'} 
                  h={'480px'}
                  className='h-full flex flex-col'
                  >
                     <Autocomplete
                     className="procuraAvaria"
                     placeholder="Procurar"
                     value={autocompleteFilter}
                     onChange={handleAutocompleteChange}
                     data={avariasCache.map((avaria) => avaria.Avaria)}
                     dropdownOpened={false} />
                     <ScrollArea className='flex-1 pb-1 px-1' ref={scrollAreaRef}>
                        {avariasCache
                           .filter(avaria => avaria.Avaria.toLowerCase().includes(autocompleteFilter))
                           .map((avaria) => (
                              <Checkbox 
                              className="avaria-item px-1" 
                              key={avaria.ID} 
                              label={avaria.Avaria} 
                              checked={formValues.defeitos.includes(avaria.Avaria)}
                              onChange={() => handleDefeitoChange(avaria.Avaria)}
                              disabled={!isEditable}
                              styles={{
                                 root:{
                                    paddingTop:'4px'
                                 },
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
                  </Fieldset>
               </Flex>

         </form></Box>      
      </div>
   );
}

export default NRExternaForm;