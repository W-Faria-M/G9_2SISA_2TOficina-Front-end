import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import CadastroCliente from "./pages/cadastroCliente";
import LoginCliente from "./pages/loginCliente";
import Home from "./pages/home";
import LoginFuncionario from "./pages/loginFuncionario";
import RedirectMessage from "./pages/redirect-message";
import MenuHamburguer from "./components/menu-hamburguer";
import AgendamentosFeitos from "./pages/agendamentosFeitos";

function App() {
  return (
    <Router>
      {/* <MenuHamburguer /> Menu Hamburguer visível em todas as páginas */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar /> {/* Navbar visível na Home */}
              <Home />
            </>
          }/>
        <Route path="/cadastro-cliente" 
        element={
            <>
              <Navbar /> {/* Navbar visível apenas no CadastroCliente */}
              <CadastroCliente /> 
            </>
          }/>
        <Route path="/login-cliente"  element={
            <>
              <Navbar /> {/* Navbar visível no LoginCliente */}
              <LoginCliente /> 
            </>
          }/>

        <Route path="/login-funcionario" element={<LoginFuncionario />} />
        <Route path="/redirect-message" element={<RedirectMessage />} />
        <Route path="/agendamentos-feitos" element={<AgendamentosFeitos />} />
      </Routes>
    </Router>
  );
}

export default App;