import React from 'react';
// Formulários principais
import NRCircuitoForm from '../../components/reparacoes/Circuitos/nr-circuito-form';
import NRExternaForm from '../../components/reparacoes/Externa/nr-externa-form';
import NRInternaForm from '../../components/reparacoes/Interna/nr-interna-form';
import NClienteForm from '../../components/clientes/novo-cliente-form';

// determina que opção foi selecionada na sidebar para gerar formulários
interface RenderFormularioProps { opcaoSelecionada: string; }

const RenderFormulario: React.FC<RenderFormularioProps> = ({opcaoSelecionada}) => {
   const conteudos: Record<string, React.FC> = {
      reparInterna: NRInternaForm,
      reparExterna: NRExternaForm,
      reparCircuito: NRCircuitoForm,
      novoCliente: NClienteForm
   };
   const FormSelecionado = conteudos[opcaoSelecionada];

   return (<FormSelecionado />);
};
export default RenderFormulario;