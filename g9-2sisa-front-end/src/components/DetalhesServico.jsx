import "./DetalhesServico.css";

export default function DetalhesServico({ isOpen, onClose, servico }) {
  if (!isOpen || !servico) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>✕</button>
        <h2 className="popup-title">Detalhes</h2>

        <p><strong>Serviço:</strong> {servico.nome}</p>

        <div className="status-linha">
          <span><strong>Status:</strong></span>
          <span className="status-badge">
            {servico.ativo ? "✓ Ativo" : "✗ Inativo"}
          </span>
        </div>

        <p><strong>Categoria:</strong> {servico.categoria}</p>
        <p><strong>É rápido:</strong> {servico.rapido ? "Sim" : "Não"}</p>

        <div className="descricao-box">
          {servico.descricao}
        </div>
      </div>
    </div>
  );
}
