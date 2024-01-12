import React, { useRef } from 'react';
import { Text, Flex, TextInput, Textarea,  Box, Fieldset, Button, Stack, Grid} from '@mantine/core';
import { useForm } from '@mantine/form';
import fetchData from '../../api/fetchData';

interface Contacto {
   Nome: string;
   Tel: string;
   Obs: string;
   Email: string;
}

interface FormValues {
   Nome: string;
   Morada: string;
   Contactos: Contacto[];
}

const NClienteForm: React.FC = () => {

   const formRef = useRef<HTMLFormElement>(null);
   const form = useForm<FormValues>({
      initialValues: {
         Nome: '',
         Morada: '',
         Contactos: [{ Nome: '', Tel: '', Email: '', Obs: '' }],
      },
      validate: {
         Nome: (value) => (value ? null : 'Nome is required'),
         Morada: (value) => (value ? null : 'Morada is required'),
         Contactos: (value) => value.every(contact => 
            contact.Nome && contact.Tel && contact.Email && contact.Obs
            ? null : { Nome: 'Nome is required', Tel: 'Tel is required', Email: 'Email is required', Obs: 'Observations are required' }
         ),
      },
   });

   const addContact = () => {
      const newContactos = [...form.values.Contactos, { Nome: '', Tel: '', Email: '', Obs: '' }];
      form.setFieldValue('Contactos', newContactos);
   };

   const validateContactos = () => {
      const errors: { Contactos?: { [key: string]: Partial<Contacto> } } = {};
      form.values.Contactos.forEach((contacto, index) => {
         let contactErrors: Partial<Contacto> = {};
         if (contacto.Email && !/^\S+@\S+\.\S+$/.test(contacto.Email)) {
            contactErrors.Email = 'Invalid email';
         }
         // Add more validations for Nome, Tel, Obs as needed

         if (Object.keys(contactErrors).length) {
            if (!errors.Contactos) { errors.Contactos = {}; }
            errors.Contactos[index] = contactErrors;
         }
      });
      return errors;
   };

   const generateUniqueId = async () => {
      try {
         const data = await fetchData('clientes');
         const maxId = data.reduce((max: number, item: any) => (item.ID > max ? item.ID : max), 0);
         return maxId + 1;
      } catch (error) {
         console.error('Error fetching data for ID generation:', error);
         throw error;
      }
   };

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const contactosErrors = validateContactos();
      if (await form.validate() && Object.keys(contactosErrors).length === 0) {
         const uniqueId = await generateUniqueId();
         const formData = {
         ID: uniqueId,
         ...form.values,
         };
         console.log('Form Data:', formData);
         // Handle the form submission here
      } else {
         //form.setErrors(contactosErrors);
      }
   };

   // <Button onClick={() => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true }))}>Submit Form from Outside</Button>
      

   return (
      <div className='p-5 h-full'>         
         <Text className='font-bold' size="xl">Novo Cliente</Text>
         
         <Box mx="auto">
         <form 
         className='h-full'
         ref={formRef} 
         onSubmit={handleSubmit} >
            <Stack 
            justify="center"
            align="center">

               <Fieldset legend="Dados do cliente" className='lg-w-1/2'>                  
                  <TextInput
                  label="Nome"
                  placeholder="Nome da Empresa"
                  withAsterisk
                  {...form.getInputProps('Nome')}
                  />
                  <Textarea
                     label="Morada"
                     placeholder="Endereço"
                     withAsterisk
                     {...form.getInputProps('Morada')}
                  />                  
                  <Button onClick={addContact} className='normalBtn'>Novo Contacto</Button> 
               </Fieldset>

               
               {/* Novo Contacto */}
               <Fieldset legend='Contactos'>
                  <Grid grow>
                     {form.values.Contactos.map((contacto, index) => (
                        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                           <React.Fragment key={index}>
                              <Fieldset legend={`Contacto ${index + 1}`} className='w-64'>
                                 <Flex direction="column" gap="sm" w={'100%'} justify={'left'}>
                                    <TextInput
                                       label="Nome"
                                       placeholder="Nome do Contacto"
                                       {...form.getInputProps(`Contactos[${index}].Nome`)}
                                    />

                                    <TextInput
                                       label="Telefone"
                                       placeholder="Telefone do Contacto"
                                       {...form.getInputProps(`Contactos[${index}].Tel`)}
                                    />

                                    <Textarea
                                       label="Observações"
                                       placeholder="Observações do Contacto"
                                       {...form.getInputProps(`Contactos[${index}].Obs`)}
                                    />

                                    <TextInput
                                       label="Email"
                                       placeholder="Email do Contacto"
                                       {...form.getInputProps(`Contactos[${index}].Email`)}
                                    />
                                 </Flex>
                              </Fieldset>
                           </React.Fragment>
                        </Grid.Col>
                     ))}
                  </Grid>
               </Fieldset>
               {/* /Novo Contacto */}

            </Stack> 
         </form>
         </Box>     
         
      </div>
   );
}

export default NClienteForm;