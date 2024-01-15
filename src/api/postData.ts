const postData = async (dataType: string, data: any) => {
   let url = `http://localhost:3000/api/${dataType}`;
   try {
      const response = await fetch(url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
      });
      if (!response.ok) { throw new Error(`Envio de dados falhou - Aplicação. Status: ${response.status}`); }
      return await response.json();
   } catch (error) {
      console.error('Erro ao enviar dados (post) - Aplicação:', error);
      throw error;
   }
}

export default postData;

/* uso:

   postData('yourDataType', yourData)
   .then(responseData => {
      // Handle success
      console.log(responseData);
   })
   .catch(error => {
      // Handle errors
      console.error(error);
   });

*/