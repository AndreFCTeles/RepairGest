import React from 'react';
import Procura from '../partilhado/procura';
import DbDisplay from '../partilhado/db-display';

const ReparConteudo:React.FC = () => {
   return (    
      <>
         <div className="flex flex-col flex-1 bg-gray-100">
            <div className="p-2 flex flex-row overflow-auto bg-gray-600 text-white">
               <p>Filtros</p>               
               <Procura />
            </div>
            <DbDisplay>
               <p>Reparações-Conteúdo</p>
            </DbDisplay>
         </div>
      </>
   );
};

export default ReparConteudo;