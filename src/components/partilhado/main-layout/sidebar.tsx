import React, { ReactNode } from 'react';

interface SidebarProps { children: ReactNode; }

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
   return (
      <div className="flex flex-col bg-gray-300 p-4 w-1/5 min-w-[190px] max-w-xs">
         {children}
      </div>
   );
};

export default Sidebar;