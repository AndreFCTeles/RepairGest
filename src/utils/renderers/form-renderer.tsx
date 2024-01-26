import React from 'react';
// Formulários principais
import NRCircuitoForm from '../../components/reparCircuito/circuito-form';
import NRExternaForm from '../../components/reparMaquina/Externa/externa-form';
import NRInternaForm from '../../components/reparMaquina/Interna/interna-form';
import NClienteForm from '../../components/clientes/cliente-form';

// determina que opção foi selecionada na sidebar para gerar formulários
interface RenderFormularioProps { opcaoSelecionada: string; }

const RenderFormulario: React.FC<RenderFormularioProps> = ({opcaoSelecionada}) => {
   const conteudos: Record<string, React.FC<any>> = {
      reparInterna: NRInternaForm,
      reparExterna: NRExternaForm,
      reparCircuito: NRCircuitoForm,
      novoCliente: NClienteForm
   };
   const FormSelecionado = conteudos[opcaoSelecionada];

   return (<FormSelecionado />);
};
export default RenderFormulario;