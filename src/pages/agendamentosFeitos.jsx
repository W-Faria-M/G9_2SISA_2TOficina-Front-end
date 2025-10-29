import React, { useState, useEffect } from "react";
import FilterBar from "../components/filterBar";
import CadastroAgendamento from "../components/CadastroAgendamento";
import "./AgendamentosFeitos.css";
import "./modalAgendar.css";
import { apiRequest, formatarData } from "../helpers/utils";

export default function AgendamentosFeitos({ onDetalhes }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a visibilidade do modal

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    try {
      const data = await apiRequest("http://localhost:3001/agendamentos", "GET");
      setAgendamentos(data);
    } catch (error) {
      setError("Erro ao carregar agendamentos: " + error.message);
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAgendamento = async (id) => {
    if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      try {
        await apiRequest(`http://localhost:3001/agendamentos/${id}`, "DELETE");
        setAgendamentos(agendamentos.filter((ag) => ag.id !== id));
        alert("Agendamento cancelado com sucesso!");
      } catch (error) {
        setError("Erro ao cancelar agendamento: " + error.message);
        console.error("Erro ao cancelar agendamento:", error);
        alert("Erro ao cancelar agendamento.");
      }
    }
  };

  const handleAgendamentoSuccess = () => {
    setIsModalOpen(false); // Fecha o modal
    fetchAgendamentos(); // Recarrega a lista de agendamentos
  };

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.data.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="agendamentos-page">Carregando agendamentos...</div>;
  }

  if (error) {
    return <div className="agendamentos-page" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="agendamentos-page">
      <h1 className="titulo">Agendamentos</h1>

      <FilterBar
        onSearch={(value) => setSearchTerm(value)}
        onFilter={() => alert("Abrir filtros avançados")}
        acaoText="+ Agendar"
        onOpenAgendarModal={() => setIsModalOpen(true)} // Passa a função para abrir o modal
      />

      <div className="agendamentos-lista">
        {filteredAgendamentos.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          filteredAgendamentos.map((ag) => (
            <div key={ag.id} className="card-agendamento">
              <div className="card-topo">
                <p className="card-veiculo">Veículo: {ag.veiculo}</p>
                <p className="card-data">
                  Agendamento {formatarData(ag.data)} - {ag.hora}
                </p>
                <p className="card-entrega">
                  Tempo previsto para entrega: {ag.tempoEntrega}
                </p>
              </div>

              <div className="card-lateral">
                <div className="card-status">
                  <span className={`status-tag ${ag.status === "Concluído" ? "status-concluido" : "status-pendente"}`}>
                    {ag.status}
                  </span>
                </div>
                <span className="card-servico">Serviço: {ag.servico}</span>
                <div className="card-acoes">
                  <button className="btn-detalhes" onClick={(() => onDetalhes(ag))}>Detalhes</button>
                  {ag.status !== "Concluído" && (
                    <button className="btn-cancelar" onClick={() => handleCancelAgendamento(ag.id)}>Cancelar</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>X</button>
            <CadastroAgendamento onSuccess={handleAgendamentoSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
