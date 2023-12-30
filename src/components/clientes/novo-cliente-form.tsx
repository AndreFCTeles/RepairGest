import React from 'react';
import { Text, Stack, Flex, TextInput, Textarea,  Box, Fieldset, Select, } from '@mantine/core';
// import { useForm } from '@mantine/form';
//import { DatePickerInput , DatesProvider} from '@mantine/dates'
import 'dayjs/locale/pt';

const NClienteForm: React.FC = () => {

   return (
      <div className='p-5 h-full'>         
         <Text className='font-bold' size="xl">Novo Cliente</Text>
         
         <Box mx="auto"><form className='h-full w-full'>

            <Flex justify="center" align="center" gap="sm" className=''>
               <Fieldset legend=""> 
                  <Stack>
                     <TextInput
                     label="Empresa"
                     placeholder="Nome"
                     withAsterisk
                     />
                     <Textarea
                     size='sm'
                     label="Morada"
                     placeholder=""
                     withAsterisk
                     />
                     <Select
                     label="Revisão"
                     data={['Rev1.0', 'Rev2.0', 'Rev3.0', 'Rev4.0', 'Rev5.0', 'Rev6.0', 'Rev7.0', 'Rev8.0', 'Rev9.0']}
                     allowDeselect
                     />
                     
                  </Stack>
               </Fieldset>
            </Flex>   

         </form></Box>     
         
      </div>
   );
}

export default NClienteForm;