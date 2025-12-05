import React, { useState } from "react";
import "./ModalAvancarStatus.css";

export default function ModalAvancarStatus({ agendamento, proximoStatus, onClose, onConfirm }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const palavraChave = proximoStatus === "Em Atendimento" ? "ATENDER" : "CONCLUIR";

  const handleConfirm = () => {
    if (inputValue.trim().toUpperCase() !== palavraChave) {
      setError(`Por favor, digite "${palavraChave}" para confirmar.`);
      return;
    }
    onConfirm();
  };

  return (
    <div className="modal-avancar-overlay">
      <div className="modal-avancar-content">
        <h2 className="modal-avancar-titulo">
          Avançar status para: <span className="modal-avancar-status">{proximoStatus}</span>
        </h2>

        <div className="modal-avancar-body">
          <p className="modal-avancar-instrucao">
            Digite <strong>"{palavraChave}"</strong> para confirmar a alteração:
          </p>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError("");
            }}
            className="modal-avancar-input"
            placeholder={palavraChave}
            style={{ textTransform: 'uppercase' }}
          />

          {error && <p className="modal-avancar-error">{error}</p>}
        </div>

        <div className="modal-avancar-acoes">
          <button className="modal-avancar-btn-retornar" onClick={onClose}>
            Retornar
          </button>
          <button className="modal-avancar-btn-confirmar" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
