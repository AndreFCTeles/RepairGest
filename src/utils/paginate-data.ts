function paginateData(data:any[], page:number, pageSize:number) {
   const totalItems = data.length;
   const totalPages = Math.ceil(totalItems / pageSize);

   /*
   const pages = Array.from({ length: totalPages }, (_, index) => {
      const start = index * pageSize;
      return data.slice(start, start + pageSize);
   });
   */

   const startIndex = (page - 1) * pageSize;
   const endIndex = startIndex + pageSize;
   const paginatedData = data.slice(startIndex, endIndex);
   
   return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page
   };
}

export default paginateData;