// gestao-conteudo.tsx
import React, { useState } from 'react';
import Sidebar from '../src/components/partilhado/main-layout/sidebar';
import RenderConteudo from '../src/utils/conteudo-renderer';

// Inicialização dos props/estados para Dropdowns
interface Dropdowns {
   isOpen: boolean;
   isHidden: boolean;
}

const GestorConteudo: React.FC = () => {
   // Estados da interface
   const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('principal');
   const [dropdowns, setDropdowns] = useState<Record<string, Dropdowns>>({
      top: { isOpen: false, isHidden: true },
      bot: { isOpen: false, isHidden: true },
      clientes: { isOpen: false, isHidden: true },
   });

   // Toggling dos dropdowns
   const toggleDropdown = (dropdown: string) => {
      setDropdowns((prevDropdowns) => ({
         ...prevDropdowns,
         [dropdown]: {
         isOpen: !prevDropdowns[dropdown].isOpen,
         isHidden: !prevDropdowns[dropdown].isHidden,
         },
      }));
   };

   // Interatividade (User Experience) dos botões
   const handleButtonClick = (opcao: string) => {
      setOpcaoSelecionada(opcao);
      // Opcionalmente, fecha todos os dropdowns
      setDropdowns({
         top: { isOpen: false, isHidden: true },
         bot: { isOpen: false, isHidden: true },
         clientes: { isOpen: false, isHidden: true },
      });
   };

   return (
      <>
         <Sidebar>
         {/* REPARAÇÕES */}
         <div id="DDRepar" className={`relative overflow-hidden transition-height m-1 ${dropdowns.top.isOpen ? 'h-auto' : 'h-10'}`}>
            <button
               className="h-10 navButton"
               onClick={() => {
               handleButtonClick('reparacoes');
               toggleDropdown('top');
               }}
            >
               Reparações
            </button>
            <div className="absolute top-10 left-0 right-0">
               <div className={`relative overflow-hidden transition-height ${dropdowns.bot.isOpen ? 'h-auto' : 'h-10'}`}>
               <button className="h-10 navButton" onClick={() => toggleDropdown('bot')}>
                  Nova Reparação
               </button>
               <div className="absolute top-10 left-0 right-0">
                  <button className="h-10 navButton" disabled>
                     Interna
                  </button>
                  <button className="h-10 navButton" disabled>
                     Externa
                  </button>
                  <button className="h-10 navButton" disabled>
                     Circuitos
                  </button>
               </div>
            </div>
            <button className="h-10 navButton" disabled>
               Consulta
            </button>
            </div>
         </div>
         {/* /REPARAÇÕES */}

         {/* CLIENTES */}
         <div id="DDCliente"  className={`relative overflow-hidden transition-height ${dropdowns.clientes.isOpen ? 'h-auto' : 'h-10'}`}>
            <button className="h-10 navButton" onClick={() => {
               handleButtonClick('clientes');
               toggleDropdown('clientes');
            }}>
               Clientes
            </button>
            <div className="absolute top-10 left-0 right-0">
               <button className="h-10 navButton" disabled>
                  Novo Cliente
               </button>
               <button className="h-10 navButton" disabled>
                  Consulta
               </button>
            </div>
         </div>
         {/* /CLIENTES */}

         {/* VOLTAR */}
         {opcaoSelecionada !== 'principal' && (
            <button onClick={() => handleButtonClick('principal')} className="navButton mt-4">
               Voltar
            </button>
         )}
         </Sidebar>
         <div id="Content" className="flex flex-col flex-1 bg-gray-100">
            <RenderConteudo opcaoSelecionada={opcaoSelecionada} />
         </div>
      </>
   );
};

export default GestorConteudo;
