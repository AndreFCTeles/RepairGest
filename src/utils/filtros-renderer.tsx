import React from 'react';
// Filtros principais
import ReparFiltros from '../components/reparacoes/reparacoes-filtros';
import ClientesFiltros from '../components/clientes/clientes-filtros';
import MainFiltros from '../components/main/main-filtros';

//determina que opção foi selecionada na sidebar para gerar conteúdos
interface RenderFiltrosProps { opcaoSelecionada: string; }

const RenderFiltros: React.FC<RenderFiltrosProps> = ({opcaoSelecionada}) => {
   const conteudos: Record<string, React.FC> = {
      reparacoes: ReparFiltros,
      clientes: ClientesFiltros,
      principal: MainFiltros
   };
   const ComponenteSelecionado = conteudos[opcaoSelecionada];

   return (<ComponenteSelecionado />);
};
export default RenderFiltros;