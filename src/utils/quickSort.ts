// Inicialização do tipo de valores a ordenar
interface SortableItem {
   DataTime?: string; // Caso seja data
   [key: string]: any; // Qualquer outro tipo de dados
}

// Comparar dois valores para sorting - ordenar por data
const dateCompareFunction = (a: SortableItem, b: SortableItem): number => {
   const dateA = new Date(a.DataTime || 0);
   const dateB = new Date(b.DataTime || 0);
   //console.log(`A comparar: ${dateA} e ${dateB}`); // debug
   return dateB.getTime() - dateA.getTime();
}

// Comparar dois valores para sorting - ordenar por string
const stringCompareFunction = (a: SortableItem, b: SortableItem, field: string): number => {
   const strA = a[field] || "";
   const strB = b[field] || "";
   //console.log(`A comparar: ${strA} e ${strB}`); // debug
   if (strA < strB) { return -1; }
   if (strA > strB) { return 1; }
   return 0;
};

// Algoritmo QuickSort - https://pt.wikipedia.org/wiki/Quicksort
const quickSort = (arr: SortableItem[], field: string): SortableItem[] => {
   if (arr.length < 2) return arr; // --------------------------------------------------------------------- arr.length = 1 ou 0, aceitar valor simples em vez de array (=já ordenado)   
   const compareFunction = field === 'DataTime' ? dateCompareFunction : stringCompareFunction; // --------- Determinar tipo de comparação dependendo do tipo de dados recebidos
   // Argumentos para funcionamento do algoritmo
   const pivotIndex = Math.floor(arr.length / 2);
   const pivot = arr[pivotIndex];
   const    
      left: SortableItem[] = [], 
      right: SortableItem[] = [], 
      equal: SortableItem[] = [];

   for (let element of arr) {
      const comparison = compareFunction(element, pivot, field);
      if (comparison < 0) left.push(element);
      else if (comparison > 0) right.push(element);
      else equal.push(element);
   }
   const sortedLeft = quickSort(left, field);
   const sortedRight = quickSort(right, field);

   return [...sortedLeft, ...equal, ...sortedRight];
}

export default quickSort;