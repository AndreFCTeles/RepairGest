const criarExcerto = (text:string, maxLength = 50) => {
   if (text && text.length > maxLength) { 
      if (text.length > maxLength) { return text.substring(0, maxLength) + '...'; }
   }
   return text || '';
};

export default criarExcerto;