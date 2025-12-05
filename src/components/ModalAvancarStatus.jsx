import React, { useState } from "react";
import "./ModalAvancarStatus.css";
import PopupSucesso from "./PopupSucesso";
import PopupErro from "./PopupErro";

export default function ModalAvancarStatus({ agendamento, proximoStatus, onClose, onSuccess }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [popupSucesso, setPopupSucesso] = useState({ show: false, mensagem: "" });
  const [popupErro, setPopupErro] = useState({ show: false, mensagem: "" });

  const palavraChave = proximoStatus === "Em Atendimento" ? "ATENDER" : "CONCLUIR";

  const getStatusId = (statusNome) => {
    const statusMap = {
      'Pendente': 1,
      'Em Atendimento': 2,
      'Concluído': 3,
      'Cancelado': 4
    };
    return statusMap[statusNome] || 1;
  };

  const handleConfirm = async () => {
    if (inputValue.trim().toUpperCase() !== palavraChave) {
      setError(`Por favor, digite "${palavraChave}" para confirmar.`);
      return;
    }

    try {
      const payload = {
        statusAgendamento: {
          id: getStatusId(proximoStatus)
        }
      };

      console.log('Enviando payload de avanço de status:', payload);

      const response = await fetch(`http://localhost:8080/agendamentos/atualizar-campo/${agendamento.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao atualizar status: ${errorText}`);
      }

      setPopupSucesso({ show: true, mensagem: `Status avançado para "${proximoStatus}" com sucesso!` });
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setPopupErro({ show: true, mensagem: "Não foi possível atualizar o status. Tente novamente." });
    }
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

      {popupSucesso.show && (
        <PopupSucesso
          mensagem={popupSucesso.mensagem}
          onClose={() => {
            setPopupSucesso({ show: false, mensagem: "" });
            setTimeout(() => {
              onClose();
              if (onSuccess) onSuccess();
            }, 100);
          }}
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
