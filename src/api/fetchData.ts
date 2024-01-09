const fetchReparData = async ( page: number, pageSize: number ) => {
   try {
      const response = await fetch(`http://localhost:3000/api/repar?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) { throw new Error(`Busca de dados falhou - Aplicação. Status: ${response.status}`)};
      const fetchedData = await response.json();
      return fetchedData;
   } catch (error) {
      console.error('Erro ao buscar dados (fetch) - Aplicação:', error);
      throw error;
   }
}
const fetchClienteData = async ( page: number, pageSize: number ) => {
   try {
      const response = await fetch(`http://localhost:3000/api/data?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) { throw new Error(`Busca de dados falhou - Aplicação. Status: ${response.status}`)};
      const fetchedData = await response.json();
      return fetchedData;
   } catch (error) {
      console.error('Erro ao buscar dados (fetch) - Aplicação:', error);
      throw error;
   }
}
export default {fetchReparData,fetchClienteData};