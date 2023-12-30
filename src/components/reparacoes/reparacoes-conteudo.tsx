import React from 'react';
import Tabela from '../partilhado/tabela';
// import DbDisplay from '../partilhado/db-display';

const ReparConteudo:React.FC = () => {
   return (    
      <div className="flex bg-gray-100">             
         <p>Reparações-Conteúdo</p>{/*<DbDisplay>*/} 

         <Tabela />
      </div>
   );
};

export default ReparConteudo;