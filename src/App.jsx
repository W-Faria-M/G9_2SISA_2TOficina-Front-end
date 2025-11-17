import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import CadastroCliente from "./pages/cadastroCliente";
import MenuHamburguerCliente from "./components/menu-hamburguer";
import MenuHamburguerFuncionario from "./components/menuFunc";
import LoginCliente from "./pages/loginCliente";
import Home from "./pages/home";
import LoginFuncionario from "./pages/loginFuncionario";
import RedirectMessage from "./pages/redirect-message";
import AgendamentosFeitos from "./pages/agendamentosFeitos";
import DetalhesAgendamento from "./components/detalhesAgendamento";
import Servico from "./pages/Servico";
import SobreAgendamento from "./pages/sobreAgendamentos";
import GestaoAgendamentos from "./pages/GestaoAgendamentos";
import Dash from './pages/dash'
import Perfil from "./pages/perfil";
import RealizarAgendamento from "./pages/realizarAgendamento";
import { ModalCancelar } from "./components/ModalCancelar";
import VLibras from "./components/VLibras";


function App() {
  const [detalheSelecionado, setDetalheSelecionado] = useState(null);

  return (
    <>
      <Router>
        <VLibras />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
               
              </>
            }
          />
          <Route
            path="/cadastro-cliente"
            element={
              <>
                <Navbar />
                <CadastroCliente />
              </>
            }
          />
          <Route
            path="/login-cliente"
            element={
              <>
                <Navbar />
                <LoginCliente />
              </>
            }
          />
          <Route
            path="/Perfil"
            element={
              <>
                <MenuHamburguerCliente />
                <Perfil />
              </>
            }
          />
        
          
          <Route path="/login-funcionario" element={<LoginFuncionario />} />

          <Route 
            path="/gestao-agendamentos"
            element={
              <>
                <MenuHamburguerFuncionario />
                <GestaoAgendamentos />
              </>
            }/>

          <Route 
            path="/analises"
            element={
              <>
                <MenuHamburguerFuncionario />
                <Dash />
              </>
            }/>


          <Route path="/redirect-message" element={<RedirectMessage />} />
          <Route
            path="/agendamentos-feitos"
            element={
              <>
                <MenuHamburguerCliente />
                <AgendamentosFeitos
                  onDetalhes={(agendamento) =>
                    setDetalheSelecionado(agendamento)
                  }
                />
                {detalheSelecionado && (
                  <DetalhesAgendamento
                    agendamento={detalheSelecionado}
                    onClose={() => setDetalheSelecionado(null)}
                  />
                )}
              </>
            }
          />
          <Route
            path="/realizar-agendamento"
            element={
              <>
                <MenuHamburguerCliente />
                <RealizarAgendamento />
              </>
            }
          />
          <Route path="/servico" element={<Servico />} />
          <Route
            path="/agendamento"
            element={
              <>
                <Navbar />
                <SobreAgendamento />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
