import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterBarClient from "../components/filterBarClient";
import "./agendamentosFeitos.css";
import { apiRequest, formatarData, formatarHora } from "../helpers/utils";
import { ModalCancelar } from "../components/ModalCancelar";

export default function AgendamentosFeitos({ onDetalhes }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState(null);

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
      const data = await apiRequest(`http://localhost:8080/agendamentos?usuarioId=${usuarioId}`);
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

  const handleCancelAgendamento = async () => {
    if (!agendamentoParaCancelar) return;

    try {
      await apiRequest(
        `http://localhost:8080/agendamentos/${agendamentoParaCancelar.agendamentoId}`,
        "DELETE"
      );

      // Remove o agendamento da lista local
      setAgendamentos(agendamentos.filter(
        (ag) => ag.agendamentoId !== agendamentoParaCancelar.agendamentoId
      ));

      alert("Agendamento cancelado com sucesso!");
      setModalOpen(false);
      setAgendamentoParaCancelar(null);
    } catch (error) {
      setError("Erro ao cancelar agendamento: " + error.message);
      console.error("Erro ao cancelar agendamento:", error);
      alert("Erro ao cancelar agendamento.");
    }
  };

  const abrirModalCancelar = (agendamento) => {
    setAgendamentoParaCancelar(agendamento);
    setModalOpen(true);
  };

  // Ordena agendamentos do mais recente para o mais antigo (considerando data + hora)
  const ordenarAgendamentos = (lista) => {
    return [...lista].sort((a, b) => {
      // Ordem de prioridade: Em Atendimento → Pendente → Cancelado → Concluído
      const statusOrder = {
        "Em Atendimento": 0,
        "Pendente": 1,
        "Cancelado": 2,
        "Concluído": 3
      };

      const statusA = statusOrder[a.status] ?? 999;
      const statusB = statusOrder[b.status] ?? 999;

      // Se status diferente, ordena por prioridade
      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // Se mesmo status, ordena por data (mais antigos primeiro = primeira fila)
      const dataA = construirDataHora(a);
      const dataB = construirDataHora(b);
      return dataA - dataB;
    });
  };

  const construirDataHora = (ag) => {
    // Tenta construir Date usando data + hora; se hora ausente, usa só a data
    if (ag.dataAgendamento) {
      const hasHora = ag.horaAgendamento && ag.horaAgendamento.trim() !== "";
      const dateStr = hasHora ? `${ag.dataAgendamento}T${ag.horaAgendamento}` : ag.dataAgendamento;
      const dt = new Date(dateStr);
      // Se inválida, retorna epoch pra não quebrar sort
      if (isNaN(dt.getTime())) return new Date(0);
      return dt;
    }
    return new Date(0);
  };

  const agendamentosOrdenados = ordenarAgendamentos(agendamentos);

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    search: "",
    date: null,
    status: null,
  });

  const filteredAgendamentos = agendamentosOrdenados.filter((ag) => {
    const matchSearch =
      ag.nomeVeiculo?.toLowerCase().includes(filtrosAtivos.search.toLowerCase()) ||
      ag.servicos?.toLowerCase().includes(filtrosAtivos.search.toLowerCase()) ||
      ag.dataAgendamento?.toLowerCase().includes(filtrosAtivos.search.toLowerCase());

    const matchDate = !filtrosAtivos.date || ag.dataAgendamento === filtrosAtivos.date;

    const matchStatus = !filtrosAtivos.status || ag.status === filtrosAtivos.status;

    return matchSearch && matchDate && matchStatus;
  });

  // const filteredAgendamentos = agendamentosOrdenados.filter((ag) =>
  //   ag.dataAgendamento?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  if (loading) {
    return (
      <div className="agendamentos-page">
        <div className="sem-agendamentos">
          <p>Carregando dados...</p>
          <p>Por favor, aguarde enquanto buscamos seus agendamentos.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agendamentos-page">
        <div className="sem-agendamentos" style={{ borderColor: '#e74c3c' }}>
          <p style={{ color: '#e74c3c' }}>Erro ao carregar agendamentos</p>
          <p style={{ color: '#fff' }}>{error}</p>
          <p style={{ color: '#e74c3c' }}>Tente recarregar a página ou entre em contato com o suporte se o problema persistir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agendamentos-page">

      {modalOpen && (
        <ModalCancelar
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setAgendamentoParaCancelar(null);
          }}
          onConfirm={handleCancelAgendamento}
        />
      )}

      <h1 className="titulo">Agendamentos</h1>

      <FilterBarClient
        onSearch={(value) => setFiltrosAtivos(prev => ({ ...prev, search: value }))}
        onFilter={(filtros) => {
          console.log("Filtros aplicados:", filtros);
          setFiltrosAtivos(filtros);
        }}
        acaoText="+ Agendar"
        onOpenAgendarModal={() => navigate("/realizar-agendamento")}
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

                  <span className={`status-tag ${ag.status === "Concluído" ? "status-concluido" :
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
                    <button
                      className="btn-cancelar"
                      onClick={() => abrirModalCancelar(ag)}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal removido: agora redireciona diretamente para /realizar-agendamento */}
    </div>
  );
}
