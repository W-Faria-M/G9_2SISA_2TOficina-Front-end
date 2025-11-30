import React, { useState } from "react";
import "./detalhesAgendamento.css";
import { formatarData } from "../helpers/utils";

export default function DetalhesAgendamento({ agendamento, onClose }) {
  const [tab, setTab] = useState("descricao");
  if (!agendamento) return null;

  return (
    <div className="detalhes-overlay">
      <div className="detalhes-popup">
        <button className="detalhes-close" onClick={onClose}>✕</button>
        <h2 className="detalhes-titulo">Detalhes</h2>
        <div className="detalhes-info">
          <div className="detalhes-direita">
            <p><b>Nº {agendamento.agendamentoId} | {agendamento.nomeVeiculo}</b></p>
            <p>Agendamento {formatarData(agendamento.dataAgendamento)} - {agendamento.horaAgendamento}</p>
            <p>Tempo previsto para entrega: {agendamento.horaRetirada}</p>
          </div>
          <div className="detalhes-esquerda">
            <div className="detalhes-status">
              <span className={`status-tag ${agendamento.status === "Concluído" ? "status-concluido" :
                  agendamento.status === "Pendente" ? "status-pendente" :
                    agendamento.status === "Em Atendimento" ? "status-em-atendimento" :
                      "status-cancelado"
                }`}>
                <span style={{ color: "black" }}>Status: </span>
                {agendamento.status}
              </span>
            </div>
            <div>
              <span>Serviços:</span>
              <ul>
                {agendamento.servicos.split(',').map((servico, index) => (
                  <li key={index}>{servico.trim()}</li>
                ))}
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
            <p>{agendamento.descricao || "Nenhuma descrição adicionada"}</p>
          ) : (
            <p>{agendamento.observacao || "Nenhuma observação adicionada"}</p>
          )}
        </div>
      </div>
    </div>
  );
}