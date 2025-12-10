import { useState } from "react";
import axios from "axios";
import PopupSucesso from "./PopupSucesso";
import PopupErro from "./PopupErro";
import "./ModalUploadImagem.css";

export default function ModalUploadImagem({ 
  isOpen, 
  onClose, 
  servicoId, 
  servicoNome,
  imagemAtual,
  onUploadSucesso 
}) {
  const [arquivo, setArquivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmRemover, setShowConfirmRemover] = useState(false);
  const [popupSucesso, setPopupSucesso] = useState({ show: false, mensagem: "" });
  const [popupErro, setPopupErro] = useState({ show: false, mensagem: "" });

  const API_IMAGENS = "http://localhost:3001";

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Arquivo muito grande! Máximo 5MB.");
      return;
    }

    // Validar tipo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Tipo de arquivo inválido! Use JPG, PNG ou WEBP.");
      return;
    }

    setArquivo(file);
    setError(null);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!arquivo) {
      setError("Selecione um arquivo primeiro!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("servicoId", servicoId);

    try {
      const response = await axios.post(`${API_IMAGENS}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log("Upload bem-sucedido:", response.data);
      
      setPopupSucesso({ show: true, mensagem: "Imagem enviada com sucesso!" });
      
      // Aguarda um pouco para o popup aparecer antes de fechar
      setTimeout(() => {
        // Callback de sucesso
        if (onUploadSucesso) {
          onUploadSucesso(response.data);
        }

        // Limpar e fechar
        setArquivo(null);
        setPreview(null);
        onClose();
      }, 2500);
    } catch (err) {
      console.error("Erro no upload:", err);
      setPopupErro({ show: true, mensagem: err.response?.data?.error || "Erro ao fazer upload. Tente novamente." });
      setError(err.response?.data?.error || "Erro ao fazer upload. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemover = async () => {
    if (!imagemAtual) return;

    setLoading(true);
    setError(null);
    setShowConfirmRemover(false);

    try {
      await axios.delete(`${API_IMAGENS}/servico/${servicoId}/imagem`);
      
      setPopupSucesso({ show: true, mensagem: "Imagem removida com sucesso!" });
      
      setTimeout(() => {
        if (onUploadSucesso) {
          onUploadSucesso({ removido: true });
        }

        setPreview(null);
        onClose();
      }, 2500);
    } catch (err) {
      console.error("Erro ao remover:", err);
      setPopupErro({ show: true, mensagem: "Erro ao remover imagem. Tente novamente." });
      setError("Erro ao remover imagem.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setArquivo(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  return (
    <>
    <div className="modal-overlay">
      <div className="modal-content-upload">
        
        <h2 className="modal-title">Gerenciar Imagem</h2>
        <p className="servico-nome">{servicoNome}</p>

        {/* Imagem Atual */}
        {imagemAtual && !preview && (
          <div className="secao-imagem-atual">
            <h3>Imagem Atual:</h3>
            <img 
              src={`${API_IMAGENS}${imagemAtual}`}
              alt="Imagem atual do serviço"
              className="preview-image"
            />
            <button 
              className="btn-remover"
              onClick={() => setShowConfirmRemover(true)}
              disabled={loading}
            >
              🗑️ Remover Imagem
            </button>
          </div>
        )}

        {/* Modal de Confirmação para Remover */}
        {showConfirmRemover && (
          <div className="confirm-overlay">
            <div className="confirm-content">
              <h3>Confirmar Remoção</h3>
              <p>Deseja realmente remover esta imagem?</p>
              <p className="confirm-warning">Esta ação não pode ser desfeita!</p>
              <div className="confirm-actions">
                <button 
                  className="btn-cancelar-confirm"
                  onClick={() => setShowConfirmRemover(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirmar-remove"
                  onClick={handleRemover}
                  disabled={loading}
                >
                  {loading ? "Removendo..." : "Sim, Remover"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Nova Imagem */}
        {preview && (
          <div className="secao-preview">
            <h3>Preview:</h3>
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}

        {/* Input File */}
        <div className="secao-upload">
          <label htmlFor="file-input" className="file-label">
            📁 {arquivo ? arquivo.name : "Escolher arquivo"}
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {/* Mensagem de Erro */}
        {error && <p className="error-message">{error}</p>}

        {/* Botões de Ação */}
        <div className="modal-actions">
          <button 
            className="btn-cancelar"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            className="btn-upload"
            onClick={handleUpload}
            disabled={!arquivo || loading}
          >
            {loading ? "Enviando..." : "📤 Fazer Upload"}
          </button>
        </div>
      </div>
    </div>

    {/* Popups de Sucesso e Erro */}
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
    </>
  );
}
