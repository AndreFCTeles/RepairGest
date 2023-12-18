import React, { useState } from 'react';
import { Button, Group, Text, Collapse, Box } from '@mantine/core';
import Sidebar from '../src/components/partilhado/main-layout/sidebar';
import RenderConteudo from '../src/utils/conteudo-renderer';
import { useDisclosure } from '@mantine/hooks';

const Demo: React.FC =() =>{
   const [opened, { toggle }] = useDisclosure(false);

   return (
      <Box maw={400} mx="auto">
         <Group justify="center" mb={5}>
         <Button onClick={toggle}>Toggle content</Button>
         </Group>

         <Collapse in={opened}>
         <Text>{/* ... content */}</Text>
         </Collapse>
      </Box>
   );
}

export default Demo;