import React, { useState } from 'react';
import { Container, TextInput, Button, Center } from '@mantine/core';

interface LoginProps {
   onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginProps> = ({onLoginSuccess}) => {
   const [user, setUser] = useState('');
   const [password, setPassword] = useState('');

   const handleLogin = async () => {
      try {
         const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, password }),
         });

         if (response.ok) {
            const data = await response.json();
            console.log('Entrou como:', data.user.user);
         } else {
            const errorData = await response.json();
            console.error('Login falhou:', errorData.message);
         }
         onLoginSuccess();
      } catch (error) {
         console.error('Error during login');
      }
   };

   return (
      <>
         <Container>
            <TextInput
               label="Nome de Utilizador"
               placeholder="Utilizador"
               value={user}
               data-autofocus
               onChange={(e) => setUser(e.target.value)}
            />
            <TextInput
               label="Password"
               type="password"
               placeholder="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
            <Center><Button onClick={handleLogin} className='normalBtn'>Entrar</Button></Center>
         </Container>
      </>
   );
};

export default LoginForm;
