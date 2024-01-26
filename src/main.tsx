// ficheiro que comunica diretamente com o elemento "ROOT" em index.html

// Dependências
import ReactDOM from "react-dom/client";
import { MantineProvider } from '@mantine/core';
import { ContextMenuProvider } from "mantine-contextmenu";

// Componente principal
import App from "./App";

// Estilos
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-contextmenu/styles.css'
import "./estilos.css";

// Inicialização de temas
const theme = {
  breakpoints: {sm: '300px' },
  navbar: {breakpoint: null}
}

// Renderizar aplicação
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MantineProvider theme={theme}>
    <ContextMenuProvider>
      <App />
    </ContextMenuProvider>
  </MantineProvider>,
);
