interface DataItem { [key: string]: string | number | Date | Array<any>; }

const compareValues = (a:DataItem, b:DataItem, field:string, sortOrder:'asc' | 'desc') => {
   let valueA = a[field], valueB = b[field];

   // Comparar datas
   if (valueA instanceof Date && valueB instanceof Date) {
      valueA = valueA.getTime();
      valueB = valueB.getTime();
   }
   // Comparar arrays
   if (Array.isArray(valueA) && Array.isArray(valueB)) {
      valueA = valueA[0]?.toString().charAt(0) || "";
      valueB = valueB[0]?.toString().charAt(0) || "";
   }
   // Comparação standard
   if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
   if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
   return 0;
};

export default compareValues;