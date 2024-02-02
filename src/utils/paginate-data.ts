function paginateData(data:any[], page:number, pageSize:number) {
   const totalItems = data.length;
   const totalPages = Math.ceil(totalItems / pageSize);

   const pages = Array.from({ length: totalPages }, (_, index) => {
      const start = index * pageSize;
      return data.slice(start, start + pageSize);
   });

   return {
      pages,
      totalItems,
      totalPages,
      currentPage: page
   };
}

export default paginateData;