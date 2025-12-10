import { useState, useEffect } from "react";
import "./DetalhesServico.css";
import { booleanToYesNo } from "../helpers/utils";
import ModalUploadImagem from "./ModalUploadImagem";
import axios from "axios";

export default function DetalhesServico({ isOpen, onClose, servico, onEditar, onGerenciarImagem }) {
  const [imagemUrl, setImagemUrl] = useState(null);
  
  const API_IMAGENS = "http://localhost:3001";

  useEffect(() => {
    if (isOpen && servico) {
      verificarImagem();
    }
  }, [isOpen, servico]);

  const verificarImagem = async () => {
    try {
      const response = await axios.get(`${API_IMAGENS}/servico/${servico.id}/tem-imagem`);
      if (response.data.temImagem) {
        setImagemUrl(response.data.url);
      } else {
        setImagemUrl(null);
      }
    } catch (error) {
      console.error("Erro ao verificar imagem:", error);
      setImagemUrl(null);
    }
  };

  if (!isOpen || !servico) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>✕</button>
        <h2 className="popup-title">Detalhes</h2>

          {/* Preview da Imagem */}
          {imagemUrl && (
            <div className="detalhes-imagem-container">
              <img 
                src={`${API_IMAGENS}${imagemUrl}`}
                alt={servico.nome}
                className="detalhes-imagem-preview"
              />
            </div>
          )}

          <p><strong>Serviço:</strong> {servico.nome}</p>

        <div className="status-linha">
          <span><strong>Status:</strong></span>
          <span className="status-badge">
            {servico.status === "Ativo" ? "✓ Ativo" : "✗ Inativo"}
          </span>
        </div>

        <p><strong>Categoria:</strong> {servico.categoria}</p>
  <p><strong>É rápido:</strong> {booleanToYesNo(servico.rapido)}</p>

        <div className="descricao-box">
          {servico.descricao}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            className="btn-detalhes btn-imagem" 
            onClick={() => onGerenciarImagem(servico, imagemUrl)}
          >
            🖼️ {imagemUrl ? 'ALTERAR' : 'ADICIONAR'} IMAGEM
          </button>
          <button className="btn-detalhes" onClick={() => onEditar(servico)}>
            EDITAR
          </button>
        </div>
      </div>
    </div>
  );
}
