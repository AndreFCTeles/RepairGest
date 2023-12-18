import React from 'react';
import Banner from "./components/partilhado/main-layout/banner";
import GestorConteudo from "./components/partilhado/gestao-conteudo";
import "./estilos.css";


const App: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden">
      <Banner />
      <div className="flex h-screen">
        <GestorConteudo />
      </div>
    </div>
  );
}

export default App;
