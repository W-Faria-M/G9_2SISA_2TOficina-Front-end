import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import CadastroCliente from "./pages/cadastroCliente";
import LoginCliente from "./pages/loginCliente";
import Home from "./pages/home";
import LoginFuncionario from "./pages/loginFuncionario";
import RedirectMessage from "./pages/redirect-message";
import AgendamentosFeitos from "./pages/agendamentosFeitos";
import DetalhesAgendamento from "./components/detalhesAgendamento";
import Servico from "./pages/Servico";
import Perfil from "./pages/perfil";
import MenuHamburguer from "./components/menu-hamburguer";

function App() {
  const [detalheSelecionado, setDetalheSelecionado] = useState(null);

  return (
    <Router>
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
        <Route path="/login-funcionario" element={<LoginFuncionario />} />
        <Route path="/redirect-message" element={<RedirectMessage />} />
        <Route
          path="/agendamentos-feitos"
          element={
            <>
              <Navbar />
              <AgendamentosFeitos
                onDetalhes={(agendamento) => setDetalheSelecionado(agendamento)}
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
          path="/servico"
          element={
            <>
              <Navbar />
              <Servico />
            </>
          }
        />

        {/* ✅ Rota de perfil sem Navbar */}
        <Route path="/perfil" element={
            <>
              <MenuHamburguer />
              <Perfil />
            </>
          }/>
      </Routes>
    </Router>
  );
}

export default App;
