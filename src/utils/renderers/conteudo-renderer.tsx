import React from 'react';
// Conteúdos principais
import MainContent from '../../components/main/main-conteudo';
import ClientesConteudo from '../../components/clientes/clientes-conteudo';
import ReparConteudo from '../../components/reparacoes/reparacoes-conteudo';

//determina que opção foi selecionada na sidebar para gerar conteúdos
interface RenderConteudoProps { opcaoSelecionada: string; }

const RenderConteudo: React.FC<RenderConteudoProps> = ({opcaoSelecionada}) => {
   const conteudos: Record<string, React.FC> = {
      reparacoes: ReparConteudo,
      clientes: ClientesConteudo,
      principal: MainContent
   };
   const ComponenteSelecionado = conteudos[opcaoSelecionada];

   return (<ComponenteSelecionado />);
};
export default RenderConteudo;