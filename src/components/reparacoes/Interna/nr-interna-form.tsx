import React, { useState, useEffect } from 'react';
import { Text, Stack, Flex, TextInput, Textarea, Checkbox, Box, Select, Fieldset, Radio, Autocomplete, ScrollArea, SegmentedControl } from '@mantine/core';
import { useForm } from '@mantine/form';
import fetchData from '../../../api/fetchData';
import { DatePickerInput , DatesProvider} from '@mantine/dates'
import 'dayjs/locale/pt';

const NRInternaForm: React.FC = () => {
   // inicialização de valores para garantias e acessórios
   const [valorGar, setValorGar] = useState('nao');
   const [valorAcc, setValorAcc] = useState('nao');
   // inicialização da data
   const [data, setData] = useState<Date | null>(null);
   // inicialização de lista de Avarias
   const [avariasList, setAvariasList] = useState<any[]>([]);
   const [selectedAvaria, setSelectedAvaria] = useState<string>('');

   // inicialização de estados para formulário
   const [ordemRep, setOrdemRep] = useState("");
   const [numSerie, setNumSerie] = useState("");
   const [cliente, setCliente] = useState("");
   const [marca, setMarca] = useState("");
   const [modelo, setModelo] = useState("");
   const [tipo, setTipo] = useState("");
   const [observa, setObserva] = useState("");

   const filteredAvarias = selectedAvaria ? avariasList.filter((avaria) =>
         avaria.Nome.toLowerCase().includes(selectedAvaria.toLowerCase())
      ) : avariasList;

   useEffect(() => {
      const fetchAvarias = async () => {
         try {
            const avarias = await fetchData('tblAvarias.json'); // Fetch data from tblAvarias.json
            setAvariasList(avarias.data);
         } catch (error) {
            console.error('Erro ao buscar dados - Aplicação:', error);
         }
      };
      fetchAvarias();
   }, []);

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
                        <Autocomplete
                        className="procuraCliente"
                        placeholder="Procurar"
                        value={selectedAvaria}
                        onChange={setSelectedAvaria}
                        data={avariasList.map((avaria) => avaria.Nome)}
                        dropdownOpened={false} />
                        <ScrollArea>
                           {filteredAvarias.map((avaria) => (<Checkbox key={avaria.ID} className="avaria-item" label={avaria.Nome} />))}
                        </ScrollArea> 
                     </Stack>
                  </Fieldset>
               </Flex>

                           
         </form></Box>      
      </div>
   );
}

export default NRInternaForm;