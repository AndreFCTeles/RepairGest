import React from 'react';
import { Table } from '@mantine/core';

const flattenObject = (obj: any): { [key: string]: string } => {
   const result: { [key: string]: string } = {};

   const recurse = (current: any, path: string[] = []) => {
      for (const [key, value] of Object.entries(current)) {
         const newPath = path.concat(key);

         if (typeof value === 'object' && value !== null) {
         recurse(value, newPath);
         } else {
         result[newPath.join('.')] = String(value);
         }
      }
   };

   recurse(obj);

   return result;
};

const Tabela: React.FC<{ data: any }> = ({ data }) => {
   if (!data) {
      return null; // or display a loading message
   }

   const flattenedData = flattenObject(data);
   const keys = Object.keys(flattenedData);

   return (
      <div>
         <h2>JSON Data Table</h2>
         <Table striped highlightOnHover withColumnBorders>
            <thead>
               <tr>
                  {keys.map((key, index) => (
                  <th key={index}>{key}</th>
                  ))}
               </tr>
            </thead>
            <tbody>
               <tr>
                  {keys.map((key, index) => (
                  <td key={index}>{flattenedData[key]}</td>
                  ))}
               </tr>
            </tbody>
         </Table>
      </div>
   );
};

export default Tabela;
