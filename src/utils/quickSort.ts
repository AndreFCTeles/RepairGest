// Inicialização do tipo de valores a ordenar
interface SortableItem {[key: string]: any;}


   /* |----- TIPOS DE COMPARAÇÃO -----| */

// Comparar dois valores para sorting - DATA
const dateCompare = (a: Date, b: Date, order: string): number => {
   return order === 'asc' ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
};

// Comparar dois valores para sorting - STRING
const stringCompare = (a: string, b: string, order: string): number => {
   return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
};

// Comparar dois valores para sorting - NUMBER
const numberCompare = (a: number, b: number, order: string): number => {
   return order === 'asc' ? a - b : b - a;
};



   /* |----- ALGORITMO -----| */

// Algoritmo QuickSort - https://pt.wikipedia.org/wiki/Quicksort
const quickSort = (items: SortableItem[], field: string, order: string = 'asc'): SortableItem[] => {
   if (items.length < 2) { return items; }

   const pivot = items[0];
   const lesser: SortableItem[] = [];
   const greater: SortableItem[] = [];

   items.slice(1).forEach(item => {
      let comparison = 0;

      // Verificar se field é data
      if (field === 'DataTime' && item[field] instanceof Date && pivot[field] instanceof Date) {
         comparison = dateCompare(item[field], pivot[field], order); // Usar comparação de datas
      } else if (typeof item[field] === 'string' && typeof pivot[field] === 'string') {
         comparison = stringCompare(item[field], pivot[field], order); // Usar comparação de strings
      } else if (typeof item[field] === 'number' && typeof pivot[field] === 'number') {
         comparison = numberCompare(item[field], pivot[field], order); // Usar comparação de números
      }

      if (comparison < 0) { lesser.push(item); } 
      else { greater.push(item); }
   });

   return [...quickSort(lesser, field, order), pivot, ...quickSort(greater, field, order)];
};

export default quickSort;