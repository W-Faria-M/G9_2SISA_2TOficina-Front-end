import React, { useState, useEffect } from "react";
import FilterBar from "../components/filterBar";
import CadastroAgendamento from "../components/CadastroAgendamento";
import "./agendamentosFeitos.css";
import "./modalAgendar.css";
import { apiRequest, formatarData, formatarHora } from "../helpers/utils";

export default function AgendamentosFeitos({ onDetalhes }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a visibilidade do modal

  useEffect(() => {
    const usuarioId = sessionStorage.getItem("usuarioId");
      if (!usuarioId) {
        setError("Usuário não identificado. Faça login novamente.");
        setLoading(false);
        return;
      }
        fetchAgendamentos(usuarioId);
  }, []);

  const fetchAgendamentos = async (usuarioId) => {
    try {
      const data = await apiRequest(`http://localhost:8080/agendamentos?usuarioId=${usuarioId}`, "GET");
      // Se data for null, undefined ou array vazio, inicializa como array vazio
      setAgendamentos(Array.isArray(data) ? data : []);
    } catch (error) {
      // Se o erro for porque não há agendamentos (status 404 ou similar), 
      // não exibe erro, apenas inicializa lista vazia
      if (error.message.includes('404') || error.message.includes('não encontrado')) {
        setAgendamentos([]);
      } else {
        setError("Erro ao carregar agendamentos: " + error.message);
        console.error("Erro ao carregar agendamentos:", error);
      }
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
    const usuarioId = sessionStorage.getItem("usuarioId");
    if (usuarioId) {
      fetchAgendamentos(usuarioId); // Recarrega a lista de agendamentos
    }
  };

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.dataAgendamento.toLowerCase().includes(searchTerm.toLowerCase())
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
          agendamentos.length === 0 ? (
            <div className="sem-agendamentos">
              <p>Você ainda não possui nenhum agendamento.</p>
              <p>Seus agendamentos aparecerão listados aqui após realizar o primeiro agendamento.</p>
              <p>Clique no botão "+ Agendar" acima para começar!</p>
            </div>
          ) : (
            <div className="sem-agendamentos">
              <p>Nenhum agendamento encontrado para a pesquisa.</p>
              <p>Tente pesquisar por uma data diferente ou limpe o filtro de pesquisa.</p>
            </div>
          )
        ) : (
          filteredAgendamentos.map((ag) => (
            <div key={ag.agendamentoId} className="card-agendamento">
              <div className="card-topo">
                <p className="card-veiculo">Veículo: {ag.nomeVeiculo}</p>
                <p className="card-data">
                  Data do Agendamento: {formatarData(ag.dataAgendamento)} - {formatarHora(ag.horaAgendamento)}
                </p>
                <p className="card-entrega">
                  Hora prevista para retirada: {formatarHora(ag.horaRetirada)}
                </p>
              </div>

              <div className="card-lateral">
                <div className="card-status">
                  
                  <span className={`status-tag ${
                    ag.status === "Concluído" ? "status-concluido" :
                    ag.status === "Pendente" ? "status-pendente" : 
                    ag.status === "Em Atendimento" ? "status-em-atendimento" :
                    "status-cancelado"
                    }`}>
                    <span style={{ color: "black" }}>Status: </span>
                    {ag.status}
                  </span>
                </div>
                <span className="card-servico">Serviços: {ag.servicos}</span>
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
