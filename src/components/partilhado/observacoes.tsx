import React from "react"
import { Menu } from "@mantine/core"
import criarExcerto from "../../utils/criar-excerto";

interface ObservacoesProps{ obData?: string | null; }


const Observacoes: React.FC<ObservacoesProps> = ({obData}) => {   
  const safeObData = obData ? obData.trim() : ''; // Trata de valores undefined, null ou vazios
   if (!safeObData) { return <div></div>; }; // Placeholder para dados vazios

   return(
      <Menu shadow="md" width={200}>
         <Menu.Target>
            <div style={{ 
               cursor: 'pointer',
               whiteSpace: 'nowrap',
               overflow: 'hidden',
               textOverflow: 'ellipsis' 
            }}>
               {criarExcerto(safeObData)}
            </div>
         </Menu.Target>
         <Menu.Dropdown>
            <Menu.Item>{safeObData}</Menu.Item>
         </Menu.Dropdown>
      </Menu>
   )   
};

export default Observacoes;