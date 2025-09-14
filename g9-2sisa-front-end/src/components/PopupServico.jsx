import { useState } from "react";
import "./PopupServico.css";

export default function PopupServico({ isOpen, onClose, onConfirm }) {
  const [step, setStep] = useState("form"); // "form" ou "confirmacao"
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    rapido: false,
    ativo: true,
    descricao: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    setStep("confirmacao");
  };

  const handleConfirm = () => {
    onConfirm(formData);
    onClose();
    setStep("form");
    setFormData({ nome: "", categoria: "", rapido: false, ativo: true, descricao: "" });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>✕</button>
        <h2 className="popup-title">Adicionar Serviço</h2>

        {step === "form" && (
          <form className="popup-form" onSubmit={(e) => e.preventDefault()}>
            <label>Nome Serviço:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} />

            <label>Categoria:</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange}>
              <option value="">Selecionar</option>
              <option value="Elétrico">Elétrico</option>
              <option value="Pneus">Pneus</option>
              <option value="Manutenção">Manutenção</option>
            </select>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="rapido"
                  value="true"
                  checked={formData.rapido === "true"}
                  onChange={handleChange}
                />
                Rápido
              </label>
              <label>
                <input
                  type="radio"
                  name="rapido"
                  value="false"
                  checked={formData.rapido === "false"}
                  onChange={handleChange}
                />
                Ativo
              </label>
            </div>

            <label>Descrição:</label>
            <textarea name="descricao" value={formData.descricao} onChange={handleChange} />

            <button type="button" className="btn-adicionar" onClick={handleSubmit}>
              Adicionar
            </button>
          </form>
        )}

        {step === "confirmacao" && (
          <div className="popup-confirmacao">
            <p><strong>Nome Serviço:</strong> {formData.nome}</p>
            <p><strong>Categoria:</strong> {formData.categoria}</p>
            <p><strong>Rápido:</strong> {formData.rapido === "true" ? "Sim" : "Não"}</p>
            <p><strong>Ativo:</strong> {formData.ativo ? "Sim" : "Não"}</p>
            <p><strong>Descrição:</strong> {formData.descricao}</p>

            <div className="popup-actions">
              <button className="btn-cancelar" onClick={() => setStep("form")}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={handleConfirm}>
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
