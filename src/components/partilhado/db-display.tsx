import React, { useState } from 'react';
import FetchData from '../../api/fetchData';
import Tabela from './tabela';

const DbDisplay: React.FC = () => {
   const [jsonData, setJsonData] = useState<any | null>(null);

   const onDataFetched = (data: any) => {
      setJsonData(data);
   };

   return (
      <>
         <FetchData onDataFetched={onDataFetched} />
         <Tabela data={jsonData} />
      </>
   );
};

export default DbDisplay;
