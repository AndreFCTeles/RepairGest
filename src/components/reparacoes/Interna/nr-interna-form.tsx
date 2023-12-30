import React, { useState } from 'react';
import { Text, Stack, Flex, TextInput, Textarea, Checkbox, Box, Fieldset, Select, SegmentedControl } from '@mantine/core';
// import { useForm } from '@mantine/form';
import { DatePickerInput , DatesProvider} from '@mantine/dates'
import 'dayjs/locale/pt';

const NRInternaForm: React.FC = () => {
   // inicialização de valores para garantias e acessórios
   const [valorGar, setValorGar] = useState('nao');
   const [valorAcc, setValorAcc] = useState('nao');
   // inicialização da data
   const [data, setData] = useState<Date | null>(null);

   /*
   const form = useForm({
      initialValues: {
         email: '',
         termsOfService: false,
      },

      validate: {
         email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      },
   });
   */
   const [formData, setFormData] = useState({});

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch('http://localhost:5000/api/repairs/create', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(formData),
         });
         // Handle response as needed
      } catch (error) {
         console.error('Error submitting form:', error);
      }
   };


   return (
      <div className='p-5 h-full'>         
         <Text className='font-bold' size="xl">Reparação Interna</Text>
               
         <Box mx="auto"><form onSubmit={handleSubmit} className='h-full'>

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
                              value={data}
                              onChange={setData}
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

                  <Fieldset legend="Defeitos" className='lg-w-1/2 w-64'>
                     <Stack>
                        <Checkbox
                           mt="md"
                           label="Defeito1"
                        />
                        <Checkbox
                           label="Defeito2"
                        />
                        <Checkbox
                           label="Defeito3"
                        />
                        <Checkbox
                           label="Defeito4"
                        />
                        <Checkbox
                           label="Defeito5"
                        />
                        <Checkbox
                           label="Defeito6"
                        />
                     </Stack>
                  </Fieldset>
               </Flex>

                           
         </form></Box>      
      </div>
   );
}

export default NRInternaForm;