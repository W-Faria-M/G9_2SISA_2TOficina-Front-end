import React from 'react'
import Navbar from './components/navbar'
import CadastroCliente from './pages/cadastroCliente'
import LoginCliente from './pages/loginCliente'

function App() {

  return (
    <>
      <Navbar />
      {/* <CadastroCliente /> */}
      <LoginCliente />
    </>
  )
}

export default App
