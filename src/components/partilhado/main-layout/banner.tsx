import React from 'react';

const Banner: React.FC = () => {
   return (
      <div className='bg-white flex flex-row justify-items-center'>
         <div className="p-4 flex flex-1">
            <p className='p-2'>Logo</p>
            <p className='p-2'>REPAIRGEST</p>            
         </div>  
      </div>
   );
};

export default Banner;