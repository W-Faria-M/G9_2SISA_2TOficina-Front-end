import React from "react";
import "./DetalhesAgendamentoModal.css";

export default function DetalhesAgendamentoModal({ agendamento, onClose }) {
    if (!agendamento) return null;

    return (
        <div className="detalhes-modal-overlay" onClick={onClose}>
            <div className="detalhes-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="detalhes-modal-close" onClick={onClose}>✕</button>

                <h2 className="detalhes-modal-titulo">Detalhes</h2>

                <div className="detalhes-modal-body">
                    <div className="detalhes-coluna-esquerda">
                        <div className="detalhes-info">
                            <p className="detalhes-label">Nº X | Moto (Marca e Modelo)</p>
                            <div className="detalhes-km">
                                <span>0 Km</span>
                                <button className="detalhes-edit-icon">✎</button>
                            </div>
                        </div>

                        <div className="detalhes-info">
                            <p className="detalhes-texto">Placa: {agendamento.placa || 'ABC 1234'}</p>
                        </div>

                        <div className="detalhes-info">
                            <p className="detalhes-texto">Agendandado em: {agendamento.data}</p>
                        </div>

                        <div className="detalhes-info">
                            <p className="detalhes-texto">Data de Início: {agendamento.data}</p>
                        </div>

                        <div className="detalhes-info">
                            <p className="detalhes-label">Itens:</p>
                            <ul className="detalhes-lista">
                                <li>- Óleo</li>
                                <li>- Item 2</li>
                                <li>- Item 3</li>
                            </ul>
                        </div>
                    </div>

                    <div className="detalhes-coluna-direita">
                        <div className="detalhes-info">
                            <p className="detalhes-label">Serviços:</p>
                            <ul className="detalhes-lista">
                                <li>• {agendamento.servico}</li>
                            </ul>
                        </div>

                        <div className="detalhes-info">
                            <p className="detalhes-status-label">Status: <span className="detalhes-status-valor">{agendamento.status}</span></p>
                        </div>

                        <div className="detalhes-descricao">
                            <p className="detalhes-descricao-texto">
                                Descrição sobre o agendamento: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}