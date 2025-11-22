import { useState, useEffect } from "react";
import "./Popup.css";
import { booleanToYesNo, validateField } from "../helpers/utils";

export default function PopupServico({ isOpen, onClose, onConfirm, initialData, availableCategories }) {
  const [step, setStep] = useState("form"); // "form" ou "confirmacao"
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    rapido: true,
    ativo: true,
    descricao: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setCategorias(availableCategories || []);
      if (initialData) {
        setFormData({
          id: initialData.id,
          nome: initialData.nome || "",
          categoria: initialData.categoria || "",
          rapido: initialData.rapido === true || initialData.rapido === "true" ? true : false,
          ativo: initialData.status === "Ativo" || initialData.ativo === true || initialData.ativo === "true" ? true : false,
          descricao: initialData.descricao || "",
        });
      } else {
        setFormData({ nome: "", categoria: "", rapido: true, ativo: true, descricao: "" });
      }
    }
  }, [isOpen, initialData, availableCategories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
    // Validação instantânea
    let errorMsg;
    if (name === "nome") errorMsg = validateField("nomeServico", newValue);
    if (name === "categoria") errorMsg = validateField("nomeCategoria", newValue);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = () => {
    const nomeError = validateField("nomeServico", formData.nome);
    const categoriaError = validateField("nomeCategoria", formData.categoria);
    const newErrors = {};
    if (nomeError) newErrors.nome = nomeError;
    if (categoriaError) newErrors.categoria = categoriaError;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setStep("confirmacao");
  };

  const handleConfirm = () => {
    onConfirm(formData);
    onClose();
    setStep("form");
    setFormData({ nome: "", categoria: "", rapido: true, ativo: true, descricao: "" });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>✕</button>
  <h2 className="popup-title">{initialData ? "Editar Serviço" : "Adicionar Serviço"}</h2>

        {step === "form" && (
          <form className="popup-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="nome">Nome do Serviço:</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} />
            {errors.nome && <span className="error-message">{errors.nome}</span>}

            <label htmlFor="categoria">Categoria:</label>
            <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange}>
              <option disabled value="">Selecionar</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>
            {errors.categoria && <span className="error-message">{errors.categoria}</span>}

            <label>É rápido?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="rapido"
                  value="true"
                  checked={formData.rapido === true}
                  onChange={() => setFormData({ ...formData, rapido: true })}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="rapido"
                  value="false"
                  checked={formData.rapido === false}
                  onChange={() => setFormData({ ...formData, rapido: false })}
                />
                Não
              </label>
            </div>

            <label>Status:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="ativo"
                  value="true"
                  checked={formData.ativo === true}
                  onChange={(e) => setFormData({ ...formData, ativo: true })}
                />
                Ativo
              </label>
              <label>
                <input
                  type="radio"
                  name="ativo"
                  value="false"
                  checked={formData.ativo === false}
                  onChange={(e) => setFormData({ ...formData, ativo: false })}
                />
                Inativo
              </label>
            </div>

            <label htmlFor="descricao">Descrição:</label>
            <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} />

            <button type="button" className="btn-adicionar" onClick={handleSubmit}>
              {initialData ? "Salvar" : "Adicionar"}
            </button>
          </form>
        )}

        {step === "confirmacao" && (
          <div className="popup-confirmacao">
            <p><strong>Nome do Serviço:</strong> {formData.nome}</p>
            <p><strong>Categoria:</strong> {formData.categoria}</p>
            <p><strong>Rápido:</strong> {booleanToYesNo(formData.rapido)}</p>
            <p><strong>Ativo:</strong> {booleanToYesNo(formData.ativo)}</p>
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
