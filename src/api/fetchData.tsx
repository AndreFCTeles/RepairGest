const fetchData = async ( page: number, pageSize: number ) => {
   try {
      const response = await fetch(`http://localhost:3000/api/data?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) { throw new Error(`Busca de dados falhou. Status: ${response.status}`)};
      const fetchedData = await response.json();
      return fetchedData;
   } catch (error) {
      console.error('Erro ao buscar dados (fetch):', error);
      throw error;
   }
};
const fetchTotalCount = async () => {
   try {
      const response = await fetch('http://localhost:3000/api/total-count');
      const totalCount = await response.json();
      return { totalCount };
   } catch (error) {
      console.error('Error fetching total count:', error);
      throw error;
   }
};

export {fetchData, fetchTotalCount};
