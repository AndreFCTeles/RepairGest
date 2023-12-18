import React, { useState } from 'react';
import { Button, Group, Text, Collapse, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Sidebar from './main-layout/sidebar';
import RenderConteudo from '../../utils/conteudo-renderer';

const GestorConteudo: React.FC = () => {
   const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('principal');
   const [dropdowns, setDropdowns] = useState({
      reparacoes: false,
      bot: false,
      clientes: false,
   });

   const toggleDropdown = (dropdown: string) => {
      setDropdowns((prevDropdowns) => {
         return {
            ...Object.keys(prevDropdowns).reduce((acc, key) => {
            acc[key as keyof typeof prevDropdowns] =
               key === dropdown ? !prevDropdowns[key as keyof typeof prevDropdowns] : false;
            return acc;
            }, {} as { [key in keyof typeof prevDropdowns]: boolean }),
         };
      });
   };

   return (
      <>
         <Sidebar>
            {/* REPARAÇÕES */}
            <div className="maw-400 mx-auto">
            <Group justify="center" mb={5}>
               <Button onClick={() => toggleDropdown('reparacoes')}>
                  Reparações
               </Button>
            </Group>

            <Collapse in={dropdowns.reparacoes}>
               <div>
                  <Group>
                  <Button onClick={() => toggleDropdown('bot')}>
                     Nova Reparação
                  </Button>
                  </Group>

                  <Collapse in={dropdowns.bot}>
                  <div>
                     <Text >Interna</Text>
                     <Text>Externa</Text>
                     <Text>Circuitos</Text>
                  </div>
                  </Collapse>
               </div>
            </Collapse>

            <Button disabled>Consulta</Button>
            </div>
            {/* /REPARAÇÕES */}

            {/* CLIENTES */}
            <div className="maw-400 mx-auto">
               <Group justify="center" mb={5}>
                  <Button onClick={() => toggleDropdown('clientes')}>
                     Clientes
                  </Button>
               </Group>

               <Collapse in={dropdowns.clientes}>
                  <div>
                     <Button disabled>Novo Cliente</Button>
                     <Button disabled>Consulta</Button>
                  </div>
               </Collapse>
            </div>
            {/* /CLIENTES */}

            {/* VOLTAR */}
            {opcaoSelecionada !== 'principal' && (
               <Button onClick={() => setOpcaoSelecionada('principal')} mt={4}>
                  Voltar
               </Button>
            )}
         </Sidebar>
         <div id="Content" className="flex flex-col flex-1 bg-gray-100">
            <RenderConteudo opcaoSelecionada={opcaoSelecionada} />
         </div>
      </>
   )
};
export default GestorConteudo;