import React from 'react'
import Navbar from './components/navbar'
import CadastroCliente from './pages/cadastroCliente'
import LoginCliente from './pages/loginCliente'
import Home from './pages/home'
import LoginFuncionario from './pages/loginFuncionario';
import RedirectMessage from './pages/redirect-message';
import MenuHamburguer from "./components/menu-hamburguer";
import AgendamentosFeitos from './pages/agendamentosFeitos'
// import LoginFuncionario from './pages/loginFuncionario';
// import RedirectMessage from './pages/redirect-message';

function App() {

  return (
    <>
      {/* <MenuHamburguer /> */}
     {/* <LoginFuncionario /> */}
    {/* <RedirectMessage />; */}
      {/* <CadastroCliente />    */}
      {/* <Navbar /> */}
      {/* <LoginCliente /> */}
      <AgendamentosFeitos />
      {/* {<Home /> } */}
    </>
  )
}

export default App
