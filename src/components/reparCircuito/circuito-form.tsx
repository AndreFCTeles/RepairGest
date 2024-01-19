/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useState, useEffect, useRef } from 'react';
import { Select, Stack, Text, Flex, TextInput, Textarea, Checkbox, Box, Fieldset, Autocomplete, ScrollArea, SegmentedControl } from '@mantine/core';
import { DatePickerInput , DatesProvider} from '@mantine/dates'

// Componentes
import fetchData from '../../api/fetchData';
import postData from '../../api/postData';
import 'dayjs/locale/pt'; // Implementa calendário e formatação de data - Portugal

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
   ordemReparacao: string;
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





/* |----- COMPONENTE -----| */

const NRCircuitoForm: React.FC = () => {   
   
   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   // Inicialização do formato dos dados em formulário
   const [formValues, setFormValues] = useState<FormValues>({
      dataCalendario: null,
      ordemReparacao: '',
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

   return (
      <div className='p-5 h-full'>
         <Stack className='pb-5'>
               <Text className='font-bold' size="xl">Novo Cliente</Text>
               <Fieldset legend="Estado da Reparação" className='p-2'>
                  <SegmentedControl 
                  value={valor}
                  onChange={setValor}
                  data={[
                     {label:'Planeada', value:'planeada'},
                     {label:'Concluída', value:'concluida'}
                  ]} />
               </Fieldset>     
         </Stack>
         
         <Box mx="auto"><form className='h-full'>

            <Flex justify="center" align="center" gap="sm">
               <Fieldset legend="Detalhes"> 
                  <Stack>
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
                     <Select
                     label="Revisão"
                     data={['Rev1.0', 'Rev2.0', 'Rev3.0', 'Rev4.0', 'Rev5.0', 'Rev6.0', 'Rev7.0', 'Rev8.0', 'Rev9.0']}
                     allowDeselect
                     />
                     <Select
                     label="Revisão"
                     data={['Linha de Produção', 'Recolha Externa', 'Reparação Interna']}
                     allowDeselect
                     />
                     
                  </Stack>
               </Fieldset>
            </Flex>   

         </form></Box>     
         
      </div>
   );
}

export default NRCircuitoForm;