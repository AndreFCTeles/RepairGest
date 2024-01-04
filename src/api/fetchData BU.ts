const fetchData = async ( endpoint: string, page: number, pageSize: number, count?: number) => {
   try {
      let apiUrl = `http://localhost:3000/api/${endpoint}?page=${page}&pageSize=${pageSize}`;      
      if (count !== undefined) { apiUrl += `&count=${count}`; }

      const response = await fetch(apiUrl);
      if (!response.ok) { throw new Error(`Busca de dados falhou. Status: ${response.status}`)};
      const fetchedData = await response.json();
      if (!fetchedData || !fetchedData.data || !fetchedData.totalCount) {
         throw new Error('Invalid response data structure');
      }

      return { data: fetchedData.data, totalCount: fetchedData.totalCount };
   } catch (error) {
      console.error('Erro ao buscar dados (fetch):', error);
      throw error;
   }
};

export default fetchData;

/*
const fetchTotalCount = async () => {
   try {
      const response = await fetch('http://localhost:3000/api/total-count');
      const totalCount = await response.json();
      return { totalCount };
   } catch (error) {
      console.error('Erro ao buscar contagem de items:', error);
      throw error;
   }
};
*/

//export {fetchData, fetchTotalCount};