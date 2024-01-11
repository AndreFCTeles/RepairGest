import React, { ReactNode } from 'react';
import { Flex, Stack } from '@mantine/core';

interface BannerProps { children: ReactNode; }

const Banner: React.FC<BannerProps> = ({ children }) => {
   return (
      <Stack className='bg-white h-full w-full' gap={0}>
         <Flex className='flavourDiv h-1/4 w-full'>REPAIRgest</Flex>
         <Flex className="p-4 h-3/4" align="center">
            {children}          
         </Flex>  
      </Stack>
   );
};

export default Banner;