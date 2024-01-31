const fetchData = async (
   dataType: string,
   page?: number,
   pageSize?: number,
   sortField?: string,
   sortOrder?: string
) => {
   const queryParams = new URLSearchParams();
   queryParams.append('dataType', dataType);
   if (sortField) {
      queryParams.append('sortField', sortField);
      if (sortOrder) { queryParams.append('sortOrder', sortOrder); }
   }
   if (page !== undefined && pageSize !== undefined) {
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());
   }

   const url = `http://localhost:3000/api/getdata?${queryParams.toString()}`;

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
