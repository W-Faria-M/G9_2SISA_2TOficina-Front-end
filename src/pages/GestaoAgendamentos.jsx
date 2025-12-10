import React, { useState, useEffect } from "react";
import "./GestaoAgendamentos.css";
import FilterBar from "../components/filterBar";
import DetalhesAgendamentoModal from "../components/DetalhesAgendamentoModal";
import EditarAgendamentoModal from "../components/EditarAgendamentoModal";
import ModalAvancarStatus from "../components/ModalAvancarStatus";
import PopupSucesso from "../components/PopupSucesso";
import PopupErro from "../components/PopupErro";
import { formatarData, formatarHora } from "../helpers/utils";


export default function GestaoAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detalheSelecionado, setDetalheSelecionado] = useState(null);
  const [editarSelecionado, setEditarSelecionado] = useState(null);
  const [modalAvancarStatus, setModalAvancarStatus] = useState({ show: false, agendamento: null, proximoStatus: "" });
  const [popupSucesso, setPopupSucesso] = useState({ show: false, mensagem: "" });
  const [popupErro, setPopupErro] = useState({ show: false, mensagem: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    search: "",
    date: null,
    status: null,
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

  const construirDataHora = (ag) => {
    if (ag.data) {
      const hasHora = ag.hora && ag.hora.trim() !== "";
      const dateStr = hasHora ? `${ag.data}T${ag.hora}` : ag.data;
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
      ag.veiculo?.toLowerCase().includes(filtrosAtivos.search.toLowerCase()) ||
      ag.servico?.toLowerCase().includes(filtrosAtivos.search.toLowerCase()) ||
      ag.username?.toLowerCase().includes(filtrosAtivos.search.toLowerCase());

    const matchDate = !filtrosAtivos.date || ag.data === filtrosAtivos.date;

    const matchStatus = !filtrosAtivos.status || ag.status === filtrosAtivos.status;

    return matchSearch && matchDate && matchStatus;
  });

  const handleDetalhes = (agendamento) => {
    setDetalheSelecionado(agendamento);
  };

  const handleEditar = (agendamento) => {
    setEditarSelecionado(agendamento);
  };

  const handleAgendamentoSuccess = () => {
    setIsModalOpen(false);
    fetchAgendamentos();
  };

  const getProximoStatus = (statusAtual) => {
    if (statusAtual === "Pendente") return "Em Atendimento";
    if (statusAtual === "Em Atendimento") return "Concluído";
    return null;
  };

  const handleAvancarStatus = (agendamento) => {
    const proximoStatus = getProximoStatus(agendamento.status);
    if (proximoStatus) {
      setModalAvancarStatus({ show: true, agendamento, proximoStatus });
    }
  };

  const handleSuccessAvancoStatus = () => {
    fetchAgendamentos();
  };

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

      <FilterBar
        onSearch={(value) => setFiltrosAtivos(prev => ({ ...prev, search: value }))}
        onFilter={(filtros) => {
          console.log("Filtros aplicados:", filtros);
          setFiltrosAtivos(filtros);
        }}
        acaoText="+ Agendar"
        onOpenAgendarModal={() => setIsModalOpen(true)}
      />

      <div className="gestao-agendamentos-lista">
        {filteredAgendamentos.length === 0 ? (
          agendamentos.length === 0 ? (
            <div className="gestao-sem-resultados">
              <p>Nenhum agendamento cadastrado no sistema.</p>
              <p>Os agendamentos aparecerão listados aqui quando forem criados.</p>
              <p>Use o botão "+ Agendar" acima para criar o primeiro agendamento!</p>
            </div>
          ) : (
            <div className="gestao-sem-resultados">
              <p>Nenhum agendamento encontrado para a pesquisa.</p>
              <p>Tente pesquisar com termos diferentes ou ajuste os filtros.</p>
            </div>
          )
        ) : (
          <>
            {totalPages > 1 && (
              <div className="gestao-pagination-dots">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`gestao-pagination-dot ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Página ${page}`}
                  />
                ))}
              </div>
            )}

            {paginatedAgendamentos.map((ag, index) => (
            <div key={ag.id} className="gestao-agendamentos-card">
              <div className="gestao-agendamentos-card-topo">
                <p className="gestao-agendamentos-card-cliente"><strong>Cliente:</strong> {ag.username || 'Não informado'}</p>
                <p className="gestao-agendamentos-card-veiculo"><strong>Veículo:</strong> {ag.veiculo}</p>
                <p className="gestao-agendamentos-card-data-inicio">
                  <strong>Data de início:</strong> {formatarData(ag.data)} - {formatarHora(ag.hora)}
                </p>
              </div>

              <div className="gestao-agendamentos-card-lateral">
                <div className="gestao-agendamentos-card-status">
                  <div className="gestao-agendamentos-status-container">
                    <span className={`gestao-agendamentos-status-tag ${ag.status === "Concluído" ? "gestao-agendamentos-status-concluido" :
                      ag.status === "Pendente" ? "gestao-agendamentos-status-pendente" :
                        ag.status === "Em Atendimento" ? "gestao-agendamentos-status-em-atendimento" :
                          "gestao-agendamentos-status-cancelado"
                      }`}>
                      {ag.status}
                    </span>
                    {(ag.status === "Pendente" || ag.status === "Em Atendimento") && (
                      <button
                        className={`gestao-agendamentos-btn-avancar ${ag.status === "Pendente" ? "gestao-agendamentos-btn-avancar-atendimento" :
                          "gestao-agendamentos-btn-avancar-concluido"
                          }`}
                        onClick={() => handleAvancarStatus(ag)}
                        title={`Avançar para ${getProximoStatus(ag.status)}`}
                      >
                      </button>
                    )}
                  </div>
                </div>
                <span className="gestao-agendamentos-card-servico">Serviço: {ag.servico}</span>
                <div className="gestao-agendamentos-card-acoes">
                  <button className="gestao-agendamentos-btn-detalhes" onClick={() => handleDetalhes(ag)}>Detalhes</button>
                  <button className="gestao-agendamentos-btn-editar" onClick={() => handleEditar(ag)}>Editar</button>
                </div>
              </div>
            </div>
          ))}
          </>
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

      {modalAvancarStatus.show && (
        <ModalAvancarStatus
          agendamento={modalAvancarStatus.agendamento}
          proximoStatus={modalAvancarStatus.proximoStatus}
          onClose={() => setModalAvancarStatus({ show: false, agendamento: null, proximoStatus: "" })}
          onSuccess={handleSuccessAvancoStatus}
        />
      )}

      {popupSucesso.show && (
        <PopupSucesso
          mensagem={popupSucesso.mensagem}
          onClose={() => setPopupSucesso({ show: false, mensagem: "" })}
          darkMode={false}
        />
      )}
      {popupErro.show && (
        <PopupErro
          mensagem={popupErro.mensagem}
          onClose={() => setPopupErro({ show: false, mensagem: "" })}
          darkMode={false}
        />
      )}
    </div>
  );
}