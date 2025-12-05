import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterBarClient from "../components/filterBarClient";
import "./agendamentosFeitos.css";
import { apiRequest, formatarData, formatarHora } from "../helpers/utils";
import { ModalCancelar } from "../components/ModalCancelar";
import PopupSucesso from "../components/PopupSucesso";
import PopupErro from "../components/PopupErro";

export default function AgendamentosFeitos({ onDetalhes }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState(null);
  const [popupSucesso, setPopupSucesso] = useState({ show: false, mensagem: "" });
  const [popupErro, setPopupErro] = useState({ show: false, mensagem: "" });

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    search: "",
    date: null,
    status: null,
  });

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
      setAgendamentos(Array.isArray(data) ? data : []);
    } catch (error) {
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

  const construirDataHora = (ag) => {
    if (ag.dataAgendamento) {
      const hasHora = ag.horaAgendamento && ag.horaAgendamento.trim() !== "";
      const dateStr = hasHora ? `${ag.dataAgendamento}T${ag.horaAgendamento}` : ag.dataAgendamento;
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return new Date(0);
      return dt;
    }
    return new Date(0);
  };

  const ordenarAgendamentos = (lista) => {
    return [...lista].sort((a, b) => {
      const statusOrder = {
        "Em Atendimento": 0,
        "Pendente": 1,
        "Cancelado": 2,
        "Concluído": 3
      };

      const statusA = statusOrder[a.status] ?? 999;
      const statusB = statusOrder[b.status] ?? 999;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      const dataA = construirDataHora(a);
      const dataB = construirDataHora(b);
      return dataA - dataB;
    });
  };

  const agendamentosOrdenados = ordenarAgendamentos(agendamentos);

  const filteredAgendamentos = agendamentosOrdenados.filter((ag) => {
    const matchSearch =
      ag.nomeVeiculo?.toLowerCase().includes(filtrosAtivos.search.toLowerCase()) ||
      ag.servicos?.toLowerCase().includes(filtrosAtivos.search.toLowerCase()) ||
      ag.dataAgendamento?.toLowerCase().includes(filtrosAtivos.search.toLowerCase());

    const matchDate = !filtrosAtivos.date || ag.dataAgendamento === filtrosAtivos.date;

    const matchStatus = !filtrosAtivos.status || ag.status === filtrosAtivos.status;

    return matchSearch && matchDate && matchStatus;
  });

  const handleCancelAgendamento = async () => {
    if (!agendamentoParaCancelar) return;

    try {
      const payload = {
        statusAgendamento: {
          id: 4 // ID para status "Cancelado"
        }
      };

      const response = await fetch(
        `http://localhost:8080/agendamentos/atualizar-campo/${agendamentoParaCancelar.agendamentoId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao cancelar agendamento');
      }

      setAgendamentos(agendamentos.map(ag =>
        ag.agendamentoId === agendamentoParaCancelar.agendamentoId
          ? { ...ag, status: "Cancelado" }
          : ag
      ));

      setPopupSucesso({ show: true, mensagem: "Agendamento cancelado com sucesso!" });
      setModalOpen(false);
      setAgendamentoParaCancelar(null);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      setPopupErro({ show: true, mensagem: "Não foi possível cancelar o agendamento. Tente novamente." });
    }
  };

  const abrirModalCancelar = (agendamento) => {
    setAgendamentoParaCancelar(agendamento);
    setModalOpen(true);
  };

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

      {popupSucesso.show && (
        <PopupSucesso
          mensagem={popupSucesso.mensagem}
          onClose={() => setPopupSucesso({ show: false, mensagem: "" })}
          darkMode={true}
        />
      )}
      {popupErro.show && (
        <PopupErro
          mensagem={popupErro.mensagem}
          onClose={() => setPopupErro({ show: false, mensagem: "" })}
          darkMode={true}
        />
      )}
    </div>
  );
}