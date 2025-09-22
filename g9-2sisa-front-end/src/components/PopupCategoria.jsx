
import { useState, useEffect } from "react";
import "./Popup.css";
import { validateForm, createFormChangeHandler } from "../helpers/utils";

export default function PopupCategoria({ isOpen, onClose, onConfirm, initialData }) {
  const [step, setStep] = useState("form"); // "form" ou "confirmacao"
  const [formData, setFormData] = useState({
    nome: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      if (initialData) {
        setFormData({
          nome: initialData.nome || "",
        });
      } else {
        setFormData({ nome: "" });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const fieldsToValidate = ["nome"];
  const handleChange = createFormChangeHandler(formData, setFormData, setErrors);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, fieldsToValidate);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStep("confirmacao");
  };

  const handleConfirm = () => {
    onConfirm({ ...formData, id: initialData ? initialData.id : undefined });
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>✕</button>
        <h2 className="popup-title">{initialData ? "Editar Categoria" : "Adicionar Categoria"}</h2>

        {step === "form" && (
          <form className="popup-form" onSubmit={handleSubmit} noValidate>
            <label>Nome da Categoria:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
            {errors.nome && <span className="error-message">{errors.nome}</span>}

            <button type="submit" className="btn-adicionar">
              {initialData ? "Atualizar" : "Adicionar"}
            </button>
          </form>
        )}

        {step === "confirmacao" && (
          <div className="popup-confirmacao">
            <p><strong>Nome da Categoria:</strong> {formData.nome}</p>

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
