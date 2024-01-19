// Frameworks
import React, { useState }  from 'react';
import { Flex, Stack, Image, AppShell,  Button, Group, Collapse, Container, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// Componentes
import Banner from "./components/partilhado/banner";
import RenderFiltros from './utils/renderers/filtros-renderer';
import RenderConteudo from './utils/renderers/conteudo-renderer';
import RenderFormulario from './utils/renderers/form-renderer';
import LoginForm from './components/partilhado/login';
// Sidebar - Logotipo
import logo190x170 from './assets/logo190x170.png';




const App: React.FC = () => {
   // Estado do login
   //const [authenticated, setAuthenticated] = useState(false);
   const [showLoginModal, setShowLoginModal] = useState(true);

   // Estados para conteúdo
   const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('conteudo'); // Tipo de conteúdo: Formulário/Tabela
   const [opcaoContSelecionada, setOpcaoContSelecionada] = useState<string>('principal'); // Conteúdo de Tabela
   const [opcaoFormSelecionada, setOpcaoFormSelecionada] = useState<string>(''); // Conteúdo de Formulário

   // Estados de dropdowns - menu
   const [reparacoesState, reparacoesActions] = useDisclosure(); // Reparações A
   const [botState, botActions] = useDisclosure(); // Reparações B
   const [circuitoState, circuitoActions] = useDisclosure(); // Clientes
   const [clientesState, clientesActions] = useDisclosure(); // Clientes





   // Tipo de conteúdo a apresentar [Tabela, Formulario]
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
   };




   return (
      <AppShell
      layout='alt'
      header={{height:100}}
      navbar={{
         width: {sm: 200, md: 300, lg: 400},
         breakpoint: 'sm'
      }}>
         <AppShell.Header>            
            <Group h="100%" w="100%">
               <Banner>
                  <Group align='center' className='pl-0 pr-4'>
                     <Container hiddenFrom="sm">Menu</Container>
                  </Group>
                  {renderFiltros()}
               </Banner>
            </Group>
         </AppShell.Header>
         
         <AppShell.Navbar>            
            {showLoginModal ? null : (
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
                           circuitoActions.close();
                           clientesActions.close();
                        }}>Máquinas</Button>
                     </Group>

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
                                 className="navButton mt-1 mb-2" 
                                 onClick={() => {
                                    setOpcaoSelecionada('formulario');
                                    setOpcaoFormSelecionada('reparExterna');
                                 }}>Externa</Button>
                              </div>
                           </Collapse>
                        </div>
                        <Button  
                        className="navButton my-1" 
                        onClick={() => {
                           setOpcaoSelecionada('conteudo');
                           setOpcaoContSelecionada('reparMaquina');
                        }}>Consulta</Button>
                     </Collapse>
                  </div>
                  {/* /REPARAÇÕES */}

                  {/* CIRCUITOS */}
                  <div className='bg-opacity-30 bg-black'>
                     <Group>
                        <Button 
                        className="navButton mt-1" 
                        onClick={() => {
                           reparacoesActions.close();
                           botActions.close();
                           clientesActions.close();
                           circuitoActions.toggle();
                        }}>Circuitos</Button>
                     </Group>

                     <Collapse 
                     in={circuitoState} 
                     className='dropdown'>
                        <div>
                           <Button 
                           className="navButton mt-1" 
                           onClick={() => {
                              setOpcaoSelecionada('formulario');
                              setOpcaoFormSelecionada('reparCircuito');
                           }}>Nova Reparação</Button>
                           <Button 
                           className="navButton my-1" 
                           onClick={()=>{
                              setOpcaoSelecionada('conteudo');
                              setOpcaoContSelecionada('reparCircuito');
                           }}>Consulta</Button>
                        </div>
                     </Collapse>
                  </div>
                  {/* /CIRCUITOS */}
                  
                  {/* CLIENTES */}
                  <div className='bg-opacity-30 bg-black'>
                     <Group>
                        <Button 
                        className="navButton mt-1" 
                        onClick={() => {
                           reparacoesActions.close();
                           botActions.close();
                           circuitoActions.close();
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
                        circuitoActions.close();
                        setOpcaoSelecionada('conteudo');
                        setOpcaoContSelecionada('principal');
                     }}>Voltar</Button>
                  )}
               </Stack>
            )}
         </AppShell.Navbar>

         <AppShell.Main>
            {showLoginModal ? (
               <Modal
               opened={showLoginModal}
               onClose={() => setShowLoginModal(false)}
               title="Login"
               centered
               overlayProps={{
                  backgroundOpacity: 0.55,
                  blur: 3,
               }}
               >
                  <LoginForm
                     onLoginSuccess={() => {
                        setShowLoginModal(false);
                        //setAuthenticated(true);
                     }}
                  />
               </Modal>
            ) : (
               <div id="Content">
                  {/* Render tabela se 'conteudo' selecionado, render formulário se 'formulario' selecionado */}
                  {renderContent()}
               </div>
            )}
         </AppShell.Main>

      </AppShell>
   );
}

export default App;
