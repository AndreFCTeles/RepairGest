import React from 'react';
// Filtros principais
import ClientesFiltros from '../../components/clientes/clientes-filtros';
import MainFiltros from '../../components/main/main-filtros';
import ReparCirFiltros from '../../components/reparCircuito/circuito-filtros';
import ReparMaqFiltros from '../../components/reparMaquina/reparacoes-filtros';

//determina que opção foi selecionada na sidebar para gerar filtros
interface RenderFiltrosProps { opcaoSelecionada: string; }

const RenderFiltros: React.FC<RenderFiltrosProps> = ({opcaoSelecionada}) => {
   const conteudos: Record<string, React.FC> = {
      reparMaquina: ReparMaqFiltros,
      reparCircuito: ReparCirFiltros,
      clientes: ClientesFiltros,
      principal: MainFiltros
   };
   const ComponenteSelecionado = conteudos[opcaoSelecionada];

   return (<ComponenteSelecionado />);
};
export default RenderFiltros;