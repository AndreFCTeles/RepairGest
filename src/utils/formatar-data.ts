const formatarData = (dataString: string): string => {
   const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false //  formato 24 horas
   };

   return new Date(dataString).toLocaleDateString('pt-PT', options);
};

export default formatarData;