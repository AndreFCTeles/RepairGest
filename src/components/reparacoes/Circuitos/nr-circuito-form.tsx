import React, { useState } from 'react';
import { Text, Stack, Flex, TextInput, Textarea, Checkbox, Button, Group, Box, Fieldset, Select, SegmentedControl } from '@mantine/core';
// import { useForm } from '@mantine/form';
import { DatePickerInput , DatesProvider} from '@mantine/dates'
import 'dayjs/locale/pt';

const NRCircuitoForm: React.FC = () => {   
   const [valor, setValor] = useState('planeada');

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