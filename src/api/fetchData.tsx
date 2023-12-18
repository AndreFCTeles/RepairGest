import React, { useEffect } from 'react';

const FetchData: React.FC<{ onDataFetched: (data: any) => void }> = ({ onDataFetched }) => {
   useEffect(() => {
      fetch('http://localhost:3000/api/data')
         .then(response => response.json())
         .then(data => onDataFetched(data))
         .catch(error => console.error('Error fetching data:', error));
   }, []);

   return <div>Loading data...</div>;
};

export default FetchData;
