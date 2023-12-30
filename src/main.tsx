// ficheiro que comunica diretamente com o elemento "ROOT" em index.html
import ReactDOM from "react-dom/client";
import { MantineProvider } from '@mantine/core';
import App from "./App";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import "./estilos.css";


const theme = {
  breakpoints: {sm: '300px' },
  navbar: {breakpoint: null}
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>,
);
