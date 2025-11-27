import React, { useState, useEffect } from "react";
import "./GestaoAgendamentos.css";
import FilterBar from "../components/filterBar";
import DetalhesAgendamentoModal from "../components/DetalhesAgendamentoModal";
import EditarAgendamentoModal from "../components/EditarAgendamentoModal";


export default function GestaoAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [detalheSelecionado, setDetalheSelecionado] = useState(null);
  const [editarSelecionado, setEditarSelecionado] = useState(null);

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    search: "",
    dateFrom: null,
    dateTo: null,
    status: null,
  });

  const filteredAgendamentos = agendamentos.filter((ag) => {
    // Filtro de busca
    const q = (filtrosAtivos.search || "").toLowerCase();
    const matchSearch =
      (ag.veiculo || "").toLowerCase().includes(q) ||
      (ag.servico || "").toLowerCase().includes(q) ||
      (ag.username || "").toLowerCase().includes(q);

    // Filtro de data por intervalo
    const matchDate = (() => {
      if (!filtrosAtivos.dateFrom && !filtrosAtivos.dateTo) return true;
      if (!ag.data) return false;
      const agDt = new Date(ag.data);
      if (isNaN(agDt)) return false;

      if (filtrosAtivos.dateFrom) {
        const from = new Date(filtrosAtivos.dateFrom);
        from.setHours(0,0,0,0);
        if (agDt < from) return false;
      }
      if (filtrosAtivos.dateTo) {
        const to = new Date(filtrosAtivos.dateTo);
        to.setHours(23,59,59,999);
        if (agDt > to) return false;
      }
      return true;
    })();

    // Filtro de status
    const matchStatus = !filtrosAtivos.status || ag.status === filtrosAtivos.status;

    return matchSearch && matchDate && matchStatus;
  });

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/agendamentos');

      if (!response.ok) throw new Error('Erro ao buscar agendamentos');

      const data = await response.json();

      const agendamentosMapeados = data.map(ag => ({
        id: ag.agendamentoId,
        veiculo: ag.nomeVeiculo,
        username: ag.nomeCliente,
        usuarioId: ag.usuarioId,
        data: ag.dataAgendamento,
        hora: ag.horaAgendamento,
        horaRetirada: ag.horaRetirada,
        status: ag.status,
        servico: ag.servicos,
        descricao: ag.descricao,
        observacao: ag.observacao
      }));

      console.log('Agendamentos mapeados:', agendamentosMapeados);
      setAgendamentos(agendamentosMapeados);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // const filteredAgendamentos = agendamentos.filter((ag) =>
  //   ag.veiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   ag.servico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   ag.status?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const formatarData = (data) => {
    return data;
  };

  const handleDetalhes = (agendamento) => {
    setDetalheSelecionado(agendamento);
  };

  const handleEditar = (agendamento) => {
    setEditarSelecionado(agendamento);
  };

  const handleExcluirAgendamento = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/agendamentos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir agendamento');

      await fetchAgendamentos();
      alert('Agendamento excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir agendamento');
    }
  };

  const handleAgendamentoSuccess = () => {
    setIsModalOpen(false);
    fetchAgendamentos();
  };

  if (loading) {
    return (
      <div className="gestao-agendamentos-page">
        <div className="gestao-sem-resultados">
          <p>Carregando dados...</p>
          <p>Por favor, aguarde enquanto buscamos os agendamentos.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gestao-agendamentos-page">
        <div className="gestao-sem-resultados" style={{ borderColor: '#e74c3c' }}>
          <p style={{ color: '#e74c3c' }}>Erro ao carregar agendamentos</p>
          <p>{error}</p>
          <p>Tente recarregar a página ou entre em contato com o suporte se o problema persistir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestao-agendamentos-page">
      <h1 className="gestao-agendamentos-titulo">Agendamentos</h1>

      {/* <FilterBar
        onSearch={(value) => setSearchTerm(value)}
        onFilter={() => alert("Abrir filtros avançados")}
        acaoText="+ Agendar"
        onOpenAgendarModal={() => setIsModalOpen(true)}
      /> */}

      <FilterBar
        onSearch={(value) => setFiltrosAtivos(prev => ({ ...prev, search: value }))}
        onFilter={(filtros) => {
          console.log("Filtros aplicados:", filtros);
          setFiltrosAtivos(prev => ({ ...prev, ...filtros }));
        }}
        acaoText="+ Agendar"
        onOpenAgendarModal={() => setIsModalOpen(true)}
      />


      <div className="gestao-agendamentos-lista">
        {filteredAgendamentos.length === 0 ? (
          agendamentos.length === 0 ? (
            <div className="gestao-sem-resultados">
              <p>Nenhum agendamento cadastrado no sistema.</p>
              <p>Os agendamentos apareceram listados aqui quando forem criados.</p>
              <p>Use o botão "+ Agendar" acima para criar o primeiro agendamento!</p>
            </div>
          ) : (
            <div className="gestao-sem-resultados">
              <p>Nenhum agendamento encontrado para a pesquisa.</p>
              <p>Tente pesquisar com termos diferentes ou ajuste os filtros.</p>
            </div>
          )
        ) : (
          filteredAgendamentos.map((ag) => (
            <div key={ag.id} className="gestao-agendamentos-card">
              <div className="gestao-agendamentos-card-topo">
                <p className="gestao-agendamentos-card-veiculo">Veículo: {ag.veiculo}</p>
                <p className="gestao-agendamentos-card-cliente">Cliente: {ag.username || 'Não informado'}</p>
                <p className="gestao-agendamentos-card-data-inicio">
                  Data de início: {ag.data} - {ag.hora}
                </p>
              </div>

              <div className="gestao-agendamentos-card-lateral">
                <div className="gestao-agendamentos-card-status">
                  <span className={`gestao-agendamentos-status-tag ${ag.status === "Concluído" ? "gestao-agendamentos-status-concluido" : "gestao-agendamentos-status-pendente"}`}>
                    {ag.status}
                  </span>
                </div>
                <span className="gestao-agendamentos-card-servico">Serviço: {ag.servico}</span>
                <div className="gestao-agendamentos-card-acoes">
                  <button className="gestao-agendamentos-btn-detalhes" onClick={() => handleDetalhes(ag)}>Detalhes</button>
                  <button className="gestao-agendamentos-btn-editar" onClick={() => handleEditar(ag)}>Editar</button>
                  {/* {ag.status !== "Concluído" && (
                    <button className="gestao-agendamentos-btn-cancelar" onClick={() => handleCancelAgendamento(ag.id)}>Cancelar</button>
                  )} */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="gestao-agendamentos-modal-overlay">
          <div className="gestao-agendamentos-modal-content">
            <button className="gestao-agendamentos-modal-close-button" onClick={() => setIsModalOpen(false)}>X</button>
            <CadastroAgendamento onSuccess={handleAgendamentoSuccess} />
          </div>
        </div>
      )}

      {detalheSelecionado && (
        <DetalhesAgendamentoModal
          agendamento={detalheSelecionado}
          onClose={() => setDetalheSelecionado(null)}
        />
      )}

      {editarSelecionado && (
        <EditarAgendamentoModal
          agendamento={editarSelecionado}
          onClose={() => setEditarSelecionado(null)}
        />
      )}
    </div>
  );
}