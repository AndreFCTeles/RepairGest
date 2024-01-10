const fetchData = async (dataType: string, page?: number, pageSize?: number) => {
   let url = `http://localhost:3000/api/${dataType}`;
   if (page !== undefined && pageSize !== undefined) { url += `?page=${page}&pageSize=${pageSize}`; }
   try {
      const response = await fetch(url);
      if (!response.ok) { throw new Error(`Busca de dados falhou - Aplicação. Status: ${response.status}`)};
      const fetchedData = await response.json();
      return fetchedData;
   } catch (error) {
      console.error('Erro ao buscar dados (fetch) - Aplicação:', error);
      throw error;
   }
}
export default fetchData;