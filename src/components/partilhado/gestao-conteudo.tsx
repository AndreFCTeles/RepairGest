import React, { useState } from 'react';
import { Button, Group, Collapse, Divider  } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Sidebar from './main-layout/sidebar';
import RenderConteudo from '../../utils/conteudo-renderer';

const GestorConteudo: React.FC = () => {
   // Estados da interface / dropdowns
   const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('principal');
   const [reparacoesState, reparacoesActions] = useDisclosure();
   const [botState, botActions] = useDisclosure();
   const [clientesState, clientesActions] = useDisclosure();

   return (
      <div className="flex w-full">
         <Sidebar>
            {/* REPARAÇÕES */}
            <div className='bg-opacity-30 bg-black'> 
               <Group justify="center" mb={5}>
                  <Button className="navButton bg-blue-50" onClick={() => {
                     reparacoesActions.toggle(); 
                     clientesActions.close();
                     setOpcaoSelecionada('reparacoes');
                  }}>
                     Reparações
                  </Button>
               </Group>

               <Collapse 
                  className='{opcaoSelecionada === "reparacoes" ? mb-2 : m-0} mx-1 bg-opacity-50 bg-black' 
                  in={reparacoesState && opcaoSelecionada === 'reparacoes'}>
                  <div>
                     <Group>
                        <Button className="navButton  bg-blue-100" onClick={() => botActions.toggle()}>
                           Nova Reparação
                        </Button>
                     </Group>

                     <Collapse in={botState} className='{botState.open() ? mb-2 : m-0} mx-2'>
                        <div>
                           <Button className="navButton">Interna</Button>
                           <Button className="navButton">Externa</Button>
                           <Button className="navButton">Circuitos</Button>
                        </div>
                     </Collapse>
                  </div>
                  <Button className="navButton bg-blue-100">Consulta</Button>
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
                     setOpcaoSelecionada('clientes');
                  }}>
                     Clientes
                  </Button>
               </Group>

               <Collapse 
                  in={clientesState && opcaoSelecionada === 'clientes'} 
                  className='mx-1 {opcaoSelecionada === "clientes" ? mb-2 : m-0}'>
                  <div>
                     <Button className="navButton bg-red-100">Novo Cliente</Button>
                     <Button className="navButton bg-red-100">Consulta</Button>
                  </div>
               </Collapse>
            </div>
            {/* /CLIENTES */}

            {/* VOLTAR */}
            {opcaoSelecionada !== 'principal' && (
               <Button 
                  className="navButton" 
                  mt={4}
                  onClick={() => {
                     clientesActions.close();
                     reparacoesActions.close();
                     botActions.close();
                     setOpcaoSelecionada('principal');
               }}>
                  Voltar
               </Button>
            )}
         </Sidebar>

         <div id="Content" className="flex-1 bg-gray-100">
            <RenderConteudo opcaoSelecionada={opcaoSelecionada} />
         </div>
      </div>
   );
};

export default GestorConteudo;
