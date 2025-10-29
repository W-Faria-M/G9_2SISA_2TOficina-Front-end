
import { useEffect, useState } from "react";
import { validateField } from "../helpers/utils";

export default function CategoriaCard({ nome, onEditar, onRemover }) {
  const [error, setError] = useState("");

  useEffect(() => {
    setError(validateField("nomeCategoria", nome));
  }, [nome]);

  return (
    <div className="service-card">
      <h3>{nome}</h3>
      {error && <span style={{ color: "red", fontSize: "0.9em" }}>{error}</span>}
      <div style={{ textAlign: 'right', marginTop: '8px' }}>
        <button className="btn-detalhes" onClick={onEditar}>
          EDITAR
        </button>
        <button className="btn-remover" onClick={onRemover}>
          REMOVER
        </button>
      </div>
    </div>
  );
}
