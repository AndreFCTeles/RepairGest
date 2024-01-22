/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect } from 'react';
import { ComboboxChevron, Text, TextInput, Textarea, Flex, Box, Fieldset, Autocomplete, SegmentedControl } from '@mantine/core';
import { DatePickerInput , DatesProvider} from '@mantine/dates'

// Componentes
import fetchData from '../../api/fetchData';
import postData from '../../api/postData';
import 'dayjs/locale/pt'; // Implementa calendário e formatação de data - Portugal

// Tipos estruturados de valores para validação dos dados em fetch / dropdowns
interface Circuito { Circuito: string; }

// Tipos estruturados de valores para validação / estados do formulário
interface FormValues {
   dataCalendario: Date | null;
   ordemReparacao: string;
   numeroSerie: string;
   circuito: string;
   origem: string;
   revisao: string;
   estado: string;
   observacoes: string;
}





/* |----- COMPONENTE -----| */

const NRCircuitoForm: React.FC = () => {   
   
   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   // Inicialização do formato dos dados em formulário
   const [formValues, setFormValues] = useState<FormValues>({
      dataCalendario: null,
      circuito: '',
      estado: 'plan',
      ordemReparacao: '',
      numeroSerie: '',
      origem: '',
      revisao: '',
      observacoes: ''
   });

   // Estado para cache e uso de dados
   const [circuitosCache, setCircuitosCache] = useState<Circuito[]>([]);
   
   /* |----- FUNÇÕES "HELPER" - Separação de lógica -----| */

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
      const fetchDataAndPopulateCache = async () => {
         try {
            // Fetch Circuitos
            let circuitosData = circuitosCache;
            if (circuitosData.length === 0) {
               const res = await fetchData('getci');
               setCircuitosCache(res.data);
            }
         } catch (error) {
            console.error('Erro ao buscar dados - Aplicação:', error);
         }
      }; 
      fetchDataAndPopulateCache();
}, [circuitosCache]);


   /* |----- SUBMETER DADOS -----| */

   // Handler para submissão de dados
   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      try {
         const response = await postData('novareparcir', formValues);
         console.log('Resposta:', response);
      } catch (error) {
         console.error('Erro ao submeter dados:', error);
      }
      // console.log(formValues); // caso precise de testar
   };

   

   /* |----- JSX / GERAR ELEMENTO -----| */


   return (
      <div className='p-5 h-full'>
         <Text className='font-bold' size="xl">Nova Reparação</Text>
         <Box mx="auto"><form className='h-full' onSubmit={handleSubmit} >

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
                        />
                     </DatesProvider>
                  </Box>


                  <Flex
                  className='pb-5'
                  justify="flex-start"
                  align="center"
                  direction="row"
                  wrap="wrap"
                  gap="xs">
                     <Autocomplete
                     label="Componente"
                     placeholder=""
                     value={formValues.circuito}
                     data={circuitosCache.map(circuito => circuito.Circuito)}
                     onChange={(value) => handleInputChange('circuito', value)}
                     pointer
                     rightSection={<ComboboxChevron />}
                     />
                     <Fieldset legend="Estado" className='p-2'>
                        <SegmentedControl 
                        value={formValues.estado}
                        onChange={(value) => handleInputChange('estado', value)}
                        data={[
                           {label:'Planeada', value:'plan'},
                           {label:'Concluída', value:'conc'}
                        ]} />
                     </Fieldset>
                  </Flex>

                  <Flex
                  justify="center"
                  align="center"
                  direction="row"
                  wrap="wrap"
                  gap="xs">
                     <TextInput
                     label="Ordem de Reparação"
                     placeholder=""
                     value={formValues.ordemReparacao}
                     onChange={(e) => handleInputChange('ordemReparacao', e.target.value)}
                     />
                     <TextInput
                     label="Número de série"
                     placeholder=""
                     value={formValues.numeroSerie}
                     onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                     />
                  </Flex>


                  <Flex       
                  justify="center"
                  align="center"
                  direction="row"
                  wrap="wrap"
                  gap="xs">
                     <Autocomplete
                     label="Revisão"
                     value={formValues.revisao}
                     data={['Rev1.0', 'Rev2.0', 'Rev3.0', 'Rev4.0', 'Rev5.0', 'Rev6.0', 'Rev7.0', 'Rev8.0', 'Rev9.0']}
                     onChange={(value) => handleInputChange('revisao', value)}
                     pointer
                     rightSection={<ComboboxChevron />}
                     />
                     <Autocomplete
                     label="Origem"
                     value={formValues.origem}
                     data={['Linha de Produção', 'Recolha Externa', 'Reparação Interna']}
                     onChange={(value) => handleInputChange('origem', value)}
                     pointer
                     rightSection={<ComboboxChevron />}
                     />
                  </Flex>
                     
                  <Textarea
                  size="md"
                  label="Observações"
                  placeholder=""
                  value={formValues.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  />
               </Fieldset>
            </Flex>   

         </form></Box>     
         
      </div>
   );
}

export default NRCircuitoForm;