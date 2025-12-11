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
  const [currentPage, setCurrentPage] = useState(1);

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    search: "",
    dateFrom: null,
    dateTo: null,
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

  const handleCancelAgendamento = async () => {
    if (!agendamentoParaCancelar) return;

    try {
      await apiRequest(
        `http://localhost:8080/agendamentos/${agendamentoParaCancelar.agendamentoId}`,
        "DELETE"
      );

      setAgendamentos(agendamentos.filter(
        (ag) => ag.agendamentoId !== agendamentoParaCancelar.agendamentoId
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

  const agendamentosOrdenados = ordenarAgendamentos(agendamentos);

  // FILTRO COM INTERVALO DE DATAS (dateFrom e dateTo)
  const filteredAgendamentos = agendamentosOrdenados.filter((ag) => {
    const q = (filtrosAtivos.search || "").toLowerCase();
    const matchSearch =
      (ag.nomeVeiculo || "").toLowerCase().includes(q) ||
      (ag.servicos || "").toLowerCase().includes(q) ||
      (ag.dataAgendamento || "").toLowerCase().includes(q);

    // Filtro de intervalo de datas
    const matchDate = (() => {
      if (!filtrosAtivos.dateFrom && !filtrosAtivos.dateTo) return true;
      if (!ag.dataAgendamento) return false;

      const agDate = new Date(ag.dataAgendamento);
      if (isNaN(agDate)) return false;

      if (filtrosAtivos.dateFrom) {
        const from = new Date(filtrosAtivos.dateFrom);
        from.setHours(0, 0, 0, 0);
        if (agDate < from) return false;
      }
      if (filtrosAtivos.dateTo) {
        const to = new Date(filtrosAtivos.dateTo);
        to.setHours(23, 59, 59, 999);
        if (agDate > to) return false;
      }
      return true;
    })();

    const matchStatus = !filtrosAtivos.status || ag.status === filtrosAtivos.status;

    return matchSearch && matchDate && matchStatus;
  });

  // const filteredAgendamentos = agendamentosOrdenados.filter((ag) =>
  //   ag.dataAgendamento?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Lógica de paginação
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredAgendamentos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAgendamentos = filteredAgendamentos.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para calcular quais páginas mostrar
  const getPageNumbers = () => {
    const maxPagesToShow = 7; // Número máximo de botões de página a mostrar
    const pages = [];

    if (totalPages <= maxPagesToShow) {
      // Se tiver poucas páginas, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com reticências
      const leftOffset = Math.floor(maxPagesToShow / 2);
      const rightOffset = maxPagesToShow - leftOffset - 1;

      if (currentPage <= leftOffset + 1) {
        // Está no início
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - rightOffset) {
        // Está no final
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Está no meio
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - leftOffset + 2; i <= currentPage + rightOffset - 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
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
          console.log("agendamentosFeitos: Filtros recebidos", filtros);
          setFiltrosAtivos(prev => ({ ...prev, ...filtros }));
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
              <p>Nenhum agendamento encontrado para os filtros aplicados.</p>
              <p>Tente ajustar a pesquisa ou o intervalo de datas.</p>
            </div>
          )
        ) : (
          <>
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="pagination-arrow"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  ‹
                </button>
                <div className="pagination-dots">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`pagination-dot ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Página ${page}`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>
                <button
                  className="pagination-arrow"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Próxima página"
                >
                  ›
                </button>
              </div>
            )}

            {paginatedAgendamentos.map((ag, index) => (
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
                    {ag.status}
                  </span>
                </div>
                <span className="card-servico">Serviços: {ag.servicos}</span>
                <div className="card-acoes">
                  <button className="agendamentos-btn-detalhes" onClick={(() => onDetalhes(ag))}>Detalhes</button>
                  {ag.status !== "Concluído" && ag.status !== "Cancelado" && (
                    <button
                      className="agendamentos-btn-cancelar"
                      onClick={() => abrirModalCancelar(ag)}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          </>
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