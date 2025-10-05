import React, { useState, useEffect } from "react";
import "./GestaoAgendamentos.css";
import FilterBar from "./filterBar";

export default function GestaoAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [detalheSelecionado, setDetalheSelecionado] = useState(null);

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/agendamentos');
      if (!response.ok) throw new Error('Erro ao buscar agendamentos');
      const data = await response.json();
      setAgendamentos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.veiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.servico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatarData = (data) => {
    return data; 
  };

  const handleDetalhes = (agendamento) => {
    console.log("Detalhes do agendamento:", agendamento);
    setDetalheSelecionado(agendamento);
  };

  const handleEditar = async (agendamento) => {
    console.log("Editar agendamento:", agendamento);
    alert(`Editar agendamento: ${agendamento.veiculo}`);
  };

  const handleCancelAgendamento = async (id) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?")) return;
    
    try {
      const response = await fetch(`http://localhost:3001/agendamentos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erro ao cancelar agendamento');
      
      setAgendamentos(agendamentos.filter(ag => ag.id !== id));
      alert('Agendamento cancelado com sucesso!');
    } catch (err) {
      console.error('Erro ao cancelar:', err);
      alert('Erro ao cancelar agendamento');
    }
  };

  const handleAgendamentoSuccess = () => {
    setIsModalOpen(false);
    fetchAgendamentos(); 
  };

  if (loading) {
    return <div className="gestao-agendamentos-page">Carregando agendamentos...</div>;
  }

  if (error) {
    return <div className="gestao-agendamentos-page">Erro ao carregar: {error}</div>;
  }

  return (
    <div className="gestao-agendamentos-page">
      <h1 className="gestao-agendamentos-titulo">Agendamentos</h1>

      <FilterBar
        onSearch={(value) => setSearchTerm(value)}
        onFilter={() => alert("Abrir filtros avançados")}
        acaoText="+ Agendar"
        onOpenAgendarModal={() => setIsModalOpen(true)}
      />

      <div className="gestao-agendamentos-lista">
        {filteredAgendamentos.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
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
        <DetalhesAgendamento
          agendamento={detalheSelecionado}
          onClose={() => setDetalheSelecionado(null)}
        />
      )}
    </div>
  );
}