import React from 'react'
import Navbar from './components/navbar'
import CadastroCliente from './pages/cadastroCliente'
import LoginCliente from './pages/loginCliente'
import Home from './pages/home'
import AgendamentosFeitos from './pages/agendamentosFeitos'
import DetalhesAgendamento from './components/detalhesAgendamento'
import Servico from './pages/Servico'
import Dash from './pages/dash'
// import LoginFuncionario from './pages/loginFuncionario';
// import RedirectMessage from './pages/redirect-message';

function App() {
  const [detalheSelecionado, setDetalheSelecionado] = React.useState(null);

  return (
    <>
      {/* <RedirectMessage />; */}
      {/* <LoginFuncionario /> */}
      {/* <Navbar /> */}
      {/* <CadastroCliente /> */}
      {/* <LoginCliente /> */}
      {/* <AgendamentosFeitos
        onDetalhes={(agendamento) => setDetalheSelecionado(agendamento)}
      />
      <DetalhesAgendamento
        agendamento={detalheSelecionado}
        onClose={() => setDetalheSelecionado(null)}
      /> */}
      {/* {<Home /> } */}
      <Dash/>
    </>
  )
}

export default App