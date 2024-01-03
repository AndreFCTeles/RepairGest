// Frameworks
import React, { useState }  from 'react';
import { Flex, Stack, Image, AppShell,  Button, Group, Collapse, ScrollArea, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// Componentes
import Banner from "./components/partilhado/main-layout/banner";
import RenderFiltros from './utils/filtros-renderer';
import RenderConteudo from './utils/conteudo-renderer';
import RenderFormulario from './utils/form-renderer';
import logo190x170 from './assets/logo190x170.png';




const App: React.FC = () => {
   // Estados para conteúdo
   const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('conteudo'); // Tipo de conteúdo: Formulário/Tabela
   const [opcaoContSelecionada, setOpcaoContSelecionada] = useState<string>('principal'); // Conteúdo de Tabela
   const [opcaoFormSelecionada, setOpcaoFormSelecionada] = useState<string>(''); // Conteúdo de Formulário
   // MENU
      // Colapsa menu em viewports pequenos
      // const [opened, { toggle }] = useDisclosure();
      // Estados de dropdowns
      const [reparacoesState, reparacoesActions] = useDisclosure(); // Reparações A
      const [botState, botActions] = useDisclosure(); // Reparações B
      const [clientesState, clientesActions] = useDisclosure(); // Clientes

   // Tipo de conteúdo a apresentar [Formulario, Tabela]
   const renderContent = () => {
      if (opcaoSelecionada==='formulario') { return <RenderFormulario opcaoSelecionada={opcaoFormSelecionada} />; } 
      else { return <RenderConteudo opcaoSelecionada={opcaoContSelecionada} />; }
   };
   const renderFiltros = () => {
      if (opcaoSelecionada==='conteudo') { return <RenderFiltros opcaoSelecionada={opcaoContSelecionada} /> }
      else { return (
         <Flex justify="flex-start" gap="xs" align="center" className=''>
            <Group className=''>
               <Button type="submit" variant='default'>Confirmar</Button>
               <Button type="submit" variant='default'>Imprimir</Button>
               <Button type="submit" variant='default'>Enviar E-mail</Button>
            </Group>            
         </Flex>); }
   }





   return (
      <AppShell
      layout='alt'
      header={{height:100}}
      navbar={{
         width: {sm: 200, md: 300, lg: 400},
         breakpoint: 'sm',
         //collapsed: { mobile: !opened } 
      }}>
         <AppShell.Header>            
            <Group h="100%" w="100%">
               <Banner>
                  <Group align='center' className='pl-0 pr-4'>
                     {/*<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />*/}
                     <Container hiddenFrom="sm">Menu</Container>
                  </Group>
                  {renderFiltros()}
               </Banner>
            </Group>
         </AppShell.Header>
         
         <AppShell.Navbar>
            {/*<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />*/}
            <Stack gap={0} justify='start' className="navbar p-4 h-full ">
               <Flex id="logoContainer">
                  <Image src={logo190x170} className='pb-4 self-auto mx-auto'  />
               </Flex>
               
               {/* REPARAÇÕES */}
               <div className='bg-opacity-30 bg-black'> 
                  <Group>
                     <Button 
                     className="navButton" 
                     onClick={() => {
                        reparacoesActions.toggle(); 
                        clientesActions.close();
                     }}>Reparações</Button>
                  </Group>

                  {/* ${reparacoesState===true ? border-2: border-0} */}
                  <Collapse 
                  className='dropdown' 
                  in={reparacoesState}>
                     <div>
                        <Group>
                           <Button 
                           className="navButton mt-1" 
                           onClick={() => {
                              botActions.toggle();
                           }}>Nova Reparação</Button>
                        </Group>

                        <Collapse in={botState} className='dropdown mx-7'>
                           <div>
                              <Button 
                              className="navButton mt-1" 
                              onClick={() => {
                                 setOpcaoSelecionada('formulario');
                                 setOpcaoFormSelecionada('reparInterna');
                              }}>Interna</Button>
                              <Button 
                              className="navButton mt-1" 
                              onClick={() => {
                                 setOpcaoSelecionada('formulario');
                                 setOpcaoFormSelecionada('reparExterna');
                              }}>Externa</Button>
                              <Button 
                              className="navButton mt-1 mb-2" 
                              onClick={() => {
                                 setOpcaoSelecionada('formulario');
                                 setOpcaoFormSelecionada('reparCircuito');
                              }}>Circuitos</Button>
                           </div>
                        </Collapse>
                     </div>
                     <Button  
                     className="navButton my-1" 
                     onClick={() => {
                        setOpcaoSelecionada('conteudo');
                        setOpcaoContSelecionada('reparacoes');
                     }}>Consulta</Button>
                  </Collapse>
               </div>
               {/* /REPARAÇÕES */}

               {/* CLIENTES */}
               <div className='bg-opacity-30 bg-black'>
                  <Group>
                     <Button 
                     className="navButton mt-1" 
                     onClick={() => {
                        reparacoesActions.close();
                        botActions.close();
                        clientesActions.toggle();
                     }}>Clientes</Button>
                  </Group>

                  <Collapse 
                  in={clientesState} 
                  className='dropdown'>
                     <div>
                        <Button 
                        className="navButton mt-1" 
                        onClick={() => {
                           setOpcaoSelecionada('formulario');
                           setOpcaoFormSelecionada('novoCliente');
                        }}>Novo Cliente</Button>
                        <Button 
                        className="navButton my-1" 
                        onClick={()=>{
                           setOpcaoSelecionada('conteudo');
                           setOpcaoContSelecionada('clientes');
                        }}>Consulta</Button>
                     </div>
                  </Collapse>
               </div>
               {/* /CLIENTES */}

               {/* VOLTAR */}
               {(opcaoSelecionada === 'formulario' || opcaoContSelecionada !== 'principal') && (
                  <Button 
                  className="navButton mt-1"
                  onClick={() => {
                     clientesActions.close();
                     reparacoesActions.close();
                     botActions.close();
                     setOpcaoSelecionada('conteudo');
                     setOpcaoContSelecionada('principal');
                  }}>Voltar</Button>
               )}
            </Stack>
         </AppShell.Navbar>

         <ScrollArea>
            <AppShell.Main>
               <div id="Content" className="bg-gray-100 h-fit min-h-full">
                     {/* Render tabela se 'conteudo' selecionado, render formulário se 'formulario' selecionado */}
                     {renderContent()}
               </div>
            </AppShell.Main>
         </ScrollArea>

      </AppShell>
   );
}

export default App;
