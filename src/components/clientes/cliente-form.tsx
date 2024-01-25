/* |----- IMPORTAÇÕES -----| */

// Frameworks
import React, { useRef, useState, useEffect } from 'react';
import { Text, Flex, TextInput, Textarea,  Box, Fieldset, Button,  Group, ScrollArea} from '@mantine/core';

// Componentes
import fetchData from '../../api/fetchData';

// Tipos estruturados de valores para validação / estados - Contacto
interface Contacto {
   Nome: string;
   Tel: string;
   Obs: string;
   Email: string;
}

// Tipos estruturados de valores para validação / estados - Formulário
interface FormValues {
   Nome: string;
   Pais: string;
   Morada: string;
   Contactos: Contacto[];
}





/* |----- COMPONENTE -----| */

// const NClienteForm: React.FC<{initialData: any}> = ({initialData}) => { 
const NClienteForm: React.FC = () => { 
   
   /* |----- ESTADOS / INICIALIZAÇÃO DE VARIÁVEIS -----| */

   // Parâmetros de dimensões para conteúdo dinâmico
   const CONTACTO_WIDTH = 310; 
   const CONTACTO_GAP = 0; 

   // Estados do formulário
   const contactosRef = useRef<HTMLFieldSetElement  | null>(null);
   const contactosScrollAreaRef = useRef<HTMLDivElement | null>(null);
   const formRef = useRef<HTMLFormElement>(null);
   const [formValues, setFormValues] = useState<FormValues>({
      Nome: '',
      Morada: '',
      Pais: '',
      Contactos: [{ Nome: '', Tel: '', Email: '', Obs: '' }],
   });
   
   /*
   // transfere os dados da tabela como dados iniciais do formulário
   useEffect(() => {
      if (initialData) { 
         console.log(initialData);
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
*/





   /* |----- FUNÇÕES "HELPER" - Separação de lógica -----| */

   // Gerar ID único para dados
   const generateUniqueId = async () => {
      try {
         const data = await fetchData('getclientes');
         const maxId = data.reduce((max: number, item: any) => (item.ID > max ? item.ID : max), 0);
         return maxId + 1;
      } catch (error) {
         console.error('Error fetching data for ID generation:', error);
         throw error;
      }
   };

   // Adicionar contacto
   const addContact = () => {
      const newContactos = [...formValues.Contactos, { Nome: '', Tel: '', Email: '', Obs: '' }];
      setFormValues({ ...formValues, Contactos: newContactos });
   };

   // Eliminar contacto
   const deleteContacto = (index: number) => {
      const updatedContactos = formValues.Contactos.filter((_, idx) => idx !== index);
      setFormValues({ ...formValues, Contactos: updatedContactos });
   };

   // Determinar quantos contactos existem 
   const handleContactChange = ( index: number, field: keyof Contacto, value: string ) => {
      const updatedContactos = [...formValues.Contactos];
      updatedContactos[index][field] = value;
      setFormValues({ ...formValues, Contactos: updatedContactos });
   };





   /* |----- DIMENSÕES DINÂMICAS -----| */

   // Cálculo do tamanho dos elementos
   const getContactosWidth = (numContactos: number) => {
      if (numContactos <= 2) { return `${CONTACTO_WIDTH * numContactos + CONTACTO_GAP * (numContactos - 1)}px`; }  // Menos de dois contactos
      return `${CONTACTO_WIDTH * 2 + CONTACTO_GAP}px`; // Largura de dois contactos
   };

   // Ajuste do tamanho do elemento de contactos
   const adjustContactosListSize = () => {
      if (contactosRef.current && contactosScrollAreaRef.current) {
         const totalDeductions = 40; // Ajustes
         const availableHeight = contactosRef.current.clientHeight - totalDeductions;
         const finalHeight = availableHeight > 0 ? `${availableHeight}px` : '100%';
         contactosScrollAreaRef.current.style.height = finalHeight;
      }
   };

   // Ajuste dinâmico de tamanhos em função do tamanho da janela
   useEffect(() => {
      const resizeObserver = new ResizeObserver(() => { adjustContactosListSize(); });
      if (contactosRef.current) { resizeObserver.observe(contactosRef.current); }

      return () => { if (contactosRef.current) { resizeObserver.unobserve(contactosRef.current); }};
   }, []);
   
   // Ajustar o tamanho inicial dos elementos (quando a página é carregada)
   useEffect(() => { adjustContactosListSize(); }, [formValues.Contactos.length]);

   // botão para ser exportado para barra de "filtros"
   // <Button onClick={() => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true }))}>Submit Form from Outside</Button>





   /* |----- SUBMETER DADOS -----| */

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
   
      const uniqueId = await generateUniqueId();
      const formData = {
         ID: uniqueId,
         ...formValues,
      };
      console.log('Form Data:', formData);
   };





   /* |----- JSX / GERAR ELEMENTO -----| */

   return (
      <div className='p-5 h-full'>         
         <Text className='font-bold' size="xl">Novo Cliente</Text>
         
         <Box mx="auto">
         <form 
         className='h-full'
         ref={formRef} 
         onSubmit={handleSubmit} >
            <Group 
            justify="center"
            align="top">

               <Fieldset legend="Dados do cliente" h={'345px'}>                  
                  <TextInput
                  label="Nome"
                  placeholder="Nome da Empresa"
                  className='pb-2'
                  withAsterisk
                  value={formValues.Nome}
                  onChange={(e) => setFormValues({ ...formValues, Nome: e.target.value })}
                  />
                  <Textarea
                  label="País"
                  placeholder="País"
                  className='pb-2'
                  withAsterisk
                  value={formValues.Pais}
                  onChange={(e) => setFormValues({ ...formValues, Pais: e.target.value })}
                  />     
                  <Textarea
                  label="Morada"
                  placeholder="Endereço"
                  className='pb-2'
                  withAsterisk
                  value={formValues.Morada}
                  onChange={(e) => setFormValues({ ...formValues, Morada: e.target.value })}
                  />                  
                  <Button onClick={addContact} className='normalBtn'>Novo Contacto</Button> 
               </Fieldset>

               
               {/* Novo Contacto */}
               {formValues.Contactos.length > 0 && (
               <Fieldset 
               legend='Contactos' 
               style={{
                  width: getContactosWidth(formValues.Contactos.length),
                  height:
                     formValues.Contactos.length >= 3
                     ? `calc(480px + 50px)`
                     : '480px',
               }}
               ref={contactosRef}>
                  <ScrollArea ref={contactosScrollAreaRef} type='auto' scrollbars='y'>
                     <Flex wrap='wrap'>
                        { formValues.Contactos.map((contacto, index) => (
                           <Flex key={index} direction={{ base: 'column', md: 'row' }} className='p-2'>
                              <Fieldset legend={`Contacto ${index + 1}`} className='w-64'>
                                 <Flex 
                                 direction="column" 
                                 gap="sm"
                                 justify={'center'}
                                 style={{ flexBasis: '50%', maxWidth: '256px' }}>
                                    <TextInput
                                       label="Nome"
                                       placeholder="Nome do Contacto"
                                       value={contacto.Nome}
                                       onChange={(e) => handleContactChange(index, 'Nome', e.target.value)}
                                       />

                                    <TextInput
                                       label="Telefone"
                                       placeholder="Telefone do Contacto"
                                       withAsterisk
                                       value={contacto.Tel}
                                       onChange={(e) => handleContactChange(index, 'Tel', e.target.value)}
                                    />

                                    <TextInput
                                       label="Email"
                                       placeholder="Email do Contacto"
                                       withAsterisk
                                       value={contacto.Email}
                                       onChange={(e) => handleContactChange(index, 'Email', e.target.value)}
                                    />

                                    <Textarea
                                       label="Observações"
                                       placeholder="Observações"
                                       value={contacto.Obs}
                                       onChange={(e) => handleContactChange(index, 'Obs', e.target.value)}
                                    />
                                    <Button onClick={()=>{deleteContacto(index); console.log(`Deleted Contacto ${index}`)}} className='normalBtn' w={'100px'}>Remover</Button> 
                                 </Flex>
                                 
                              </Fieldset>
                           </Flex>
                        ))}
                     </Flex>
                  </ScrollArea>
               </Fieldset>
               )}
               {/* /Novo Contacto */}

            </Group> 
         </form>
         </Box>     
         
      </div>
   );
}

export default NClienteForm;