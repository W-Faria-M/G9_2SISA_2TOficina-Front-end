import React from 'react'
import Navbar from './components/navbar'
import CadastroCliente from './pages/cadastroCliente'
import LoginCliente from './pages/loginCliente'
import LoginFuncionario from './pages/loginFuncionario';
import RedirectMessage from './pages/redirect-message';

function App() {

  return (
    <>
    {/* <RedirectMessage />; */}
    <LoginFuncionario />
     {/* <Navbar /> */}
      {/* <CadastroCliente /> */}
      {/* <LoginCliente /> */}
    </>
  )
}

export default App
