import React from 'react';
import Procura from '../partilhado/procura';
import DbDisplay from '../partilhado/db-display';

const MainContent:React.FC = () => {
   return (      
      <>
            <div className="p-2 flex flex-row overflow-auto bg-gray-600 text-white">
               <p>Filtros</p>               
               <Procura />
            </div>
            <DbDisplay>
               <p>Principal-Conteúdo</p>
            </DbDisplay>
      </>
   );
};

export default MainContent;