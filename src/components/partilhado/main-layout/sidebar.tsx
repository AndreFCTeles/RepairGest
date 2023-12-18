import React, { ReactNode } from 'react';

interface SidebarProps { children: ReactNode; }

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
   return (
      <div className=" flex flex-col bg-gray-300 p-4 w-1/6 min-w-fit max-w-xs">
         {children}
      </div>
   );
};

export default Sidebar;