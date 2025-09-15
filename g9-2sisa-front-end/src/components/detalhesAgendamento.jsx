import React, { useState } from "react";
import "./detalhesAgendamento.css";

export default function DetalhesAgendamento({ agendamento, onClose }) {
  const [tab, setTab] = useState("descricao");
  if (!agendamento) return null;

  return (
    <div className="detalhes-overlay">
      <div className="detalhes-popup">
        <button className="detalhes-close" onClick={onClose}>✕</button>
        <h2 className="detalhes-titulo">Detalhes</h2>
        <div className="detalhes-info">
          <div>
            <p><b>Nº {agendamento.id} | {agendamento.veiculo}</b></p>
            <p>Agendamento {agendamento.data} - {agendamento.hora}</p>
            <p>Tempo previsto para entrega: {agendamento.tempoEntrega}</p>
          </div>
          <div>
            <div className="detalhes-status">
              <span>Status: </span>
              <span className="status-tag">{agendamento.status}</span>
            </div>
            <div>
              <span>Serviços:</span>
              <ul>
                <li>{agendamento.servico}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="detalhes-tabs">
          <button
            className={`tab-btn${tab === "descricao" ? " active" : ""}`}
            onClick={() => setTab("descricao")}
          >
            Descrição
          </button>
          <button
            className={`tab-btn${tab === "observacoes" ? " active" : ""}`}
            onClick={() => setTab("observacoes")}
          >
            Observações
          </button>
        </div>
        <div className="detalhes-descricao">
          {tab === "descricao" ? (
            <>Descrições sobre o estado da moto...</>
          ) : (
            <>Aqui vão as observações do agendamento...</>
          )}
        </div>
      </div>
    </div>
  );
}