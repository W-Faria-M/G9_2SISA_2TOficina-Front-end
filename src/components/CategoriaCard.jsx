
import { useEffect, useState } from "react";
import { validateField } from "../helpers/utils";

export default function CategoriaCard({ nome, onEditar }) {
  const [error, setError] = useState("");

  useEffect(() => {
    setError(validateField("nomeCategoria", nome));
  }, [nome]);

  return (
    <div className="service-card">
      <div className="service-info">
        <p><strong>Nome:</strong> {nome}</p>
        {error && <span style={{ color: "red", fontSize: "0.9em" }}>{error}</span>}
      </div>
      <div className="service-actions">
        <button className="btn-detalhes" onClick={onEditar}>
          EDITAR
        </button>
      </div>
    </div>
  );
}
