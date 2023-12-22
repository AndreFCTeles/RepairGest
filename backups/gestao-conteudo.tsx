import React, { useState } from 'react';
import { Button, Group, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Sidebar from '../src/components/partilhado/main-layout/sidebar';
import RenderConteudo from '../src/utils/conteudo-renderer';
import RenderFormulario from '../src/utils/form-renderer';


const GestorConteudo: React.FC = () => {
   // Estados para conteúdo
   const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('');
   const [opcaoContSelecionada, setOpcaoContSelecionada] = useState<string>('principal');
   const [opcaoFormSelecionada, setOpcaoFormSelecionada] = useState<string>('');
   // Estados para menus / dropdowns
   const [reparacoesState, reparacoesActions] = useDisclosure();
   const [botState, botActions] = useDisclosure();
   const [clientesState, clientesActions] = useDisclosure();

   // Tipo de conteúdo a apresentar [Formulario, Tabela]
   const renderContent = () => {
      if (opcaoSelecionada==='formulario'){
         return <RenderFormulario opcaoSelecionada={opcaoFormSelecionada} />;
      } else {
         return <RenderConteudo opcaoSelecionada={opcaoContSelecionada} />;
      }
   };

   // Menu de navegação
   return (
      <div className="flex h-full w-full min-w-64 overflow-auto">
         <div className="flex flex-col bg-gray-300 p-4 w-1/5 min-w-[190px] max-w-xs">
            {/* REPARAÇÕES */}
            <div className='bg-opacity-30 bg-black'> 
               <Group justify="center" mb={5}>
                  <Button className="navButton bg-blue-50" onClick={() => {
                     reparacoesActions.toggle(); 
                     clientesActions.close();
                     setOpcaoSelecionada('conteudo');
                     setOpcaoContSelecionada('reparacoes');
                  }}>
                     Reparações
                  </Button>
               </Group>

               <Collapse 
                  className='${opcaoSelecionada === "reparacoes" ? mb-2 : m-0} mx-1 bg-opacity-50 bg-black' 
                  in={reparacoesState && opcaoContSelecionada === 'reparacoes'}>
                  <div>
                     <Group>
                        <Button 
                        className="navButton bg-blue-100" 
                        onClick={() => {
                           botActions.toggle();
                        }}>Nova Reparação
                        </Button>
                     </Group>

                     <Collapse in={botState} className='${botState.open() ? mb-2 : m-0} mx-2'>
                        <div>
                           <Button 
                           className="navButton" onClick={() => {
                              setOpcaoSelecionada('formulario');
                              setOpcaoFormSelecionada('reparInterna');
                           }}>Interna</Button>
                           <Button 
                           className="navButton" onClick={() => {
                              setOpcaoSelecionada('formulario');
                              setOpcaoFormSelecionada('reparExterna');
                           }}>Externa</Button>
                           <Button 
                           className="navButton" onClick={() => {
                              setOpcaoSelecionada('formulario');
                              setOpcaoFormSelecionada('reparCircuito');
                           }}>Circuitos</Button>
                        </div>
                     </Collapse>
                  </div>
                  <Button  
                           className="navButton bg-blue-100" onClick={() => {
                              setOpcaoSelecionada('conteudo');
                           }}>Consulta</Button>
               </Collapse>
            </div>
            {/* /REPARAÇÕES */}

            {/* CLIENTES */}
            <div className='bg-opacity-30 bg-black'>
               <Group justify="center">
                  <Button className="navButton bg-red-50" onClick={() => {
                     reparacoesActions.close();
                     botActions.close();
                     clientesActions.toggle();
                     setOpcaoContSelecionada('clientes');
                  }}>
                     Clientes
                  </Button>
               </Group>

               <Collapse 
                  in={clientesState && opcaoContSelecionada === 'clientes'} 
                  className='mx-1 ${opcaoSelecionada === "clientes" ? mb-2 : mb-0}'>
                  <div>
                     <Button className="navButton bg-red-100" onClick={() => {
                              setOpcaoSelecionada('formulario');
                              setOpcaoFormSelecionada('novoCliente');
                           }}>Novo Cliente</Button>
                     <Button className="navButton bg-red-100">Consulta</Button>
                  </div>
               </Collapse>
            </div>
            {/* /CLIENTES */}

            {/* VOLTAR */}
            {opcaoContSelecionada !== 'principal' && (
               <Button 
                  className="navButton" 
                  mt={4}
                  onClick={() => {
                     clientesActions.close();
                     reparacoesActions.close();
                     botActions.close();
                     setOpcaoContSelecionada('principal');
               }}>
                  Voltar
               </Button>
            )}
         </div>

         <div id="Content" className="flex-1 bg-gray-100 overflow-auto h-full">
            {/* Render tabela se 'conteudo' selecionado, render formulário se 'formulario' selecionado */}
            {renderContent()}
         </div>
      </div>
   );
};

export default GestorConteudo;
