import React, { useEffect, useState } from 'react';

const FetchData: React.FC<{ onDataFetched: (data: any) => void }> = ({ onDataFetched }) => {
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetch('http://localhost:3000/api/data')
         .then((response) => response.json())
         .then((data) => {
         onDataFetched(data);
         setLoading(false);
         })
         .catch((error) => {
         console.error('Erro ao buscar dados:', error);
         setLoading(false);
         });
   }, []);

   return <div>{loading ? 'A carregar dados...' : null}</div>;
};

export default FetchData;
