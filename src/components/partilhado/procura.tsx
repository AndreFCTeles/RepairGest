const Procura = () => {
   return (
      <div>
         <form>   
            <div className="relative">
               <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg 
                     className="w-4 h-4 text-gray-500 dark:text-gray-400" 
                     aria-hidden="true" 
                     fill="none" 
                     viewBox="0 0 20 20">
                     <path 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
               </div>
               <input 
                  type="search" 
                  id="default-search" 
                  className="searchInput" 
                  placeholder="Procurar" />
               <button 
                  type="submit" 
                  className="searchButton">
                  Ir
               </button>
            </div>
         </form>
      </div>
   )
}

export default Procura