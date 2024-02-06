const fetchData = async (
   endpoint: string,
   dataType?: string,
   page?: number,
   pageSize?: number,
   sortField?: string,
   sortOrder?: string,
   filterCriteria?: { [key: string]: string }
) => {

   const queryParams = new URLSearchParams();   

   if (dataType) { queryParams.append('dataType', dataType); }

   if (sortField) {
      queryParams.append('sortField', sortField);
      if (sortOrder) { queryParams.append('sortOrder', sortOrder); }
   }

   if (page !== undefined && pageSize !== undefined) {
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());
   }

   if (filterCriteria) {
      Object.keys(filterCriteria).forEach(key => {
         if (filterCriteria[key]) { queryParams.append(key, filterCriteria[key]); }
      });
   }

   let url = '';
   if (endpoint!=='currentDateTime') { url = `http://localhost:3000/api/${endpoint}?${queryParams.toString()}`; } 
   else { url = `http://localhost:3000/api/${endpoint}`; }
   console.log(url);

   try {
      const response = await fetch(url);
      if (!response.ok) { throw new Error(`Busca de dados falhou - Aplicação. Status: ${response.status}`); }
      return await response.json();
   } catch (error) {
      console.error('Erro ao buscar dados (fetch) - Aplicação:', error);
      throw error;
   }
};

export default fetchData;