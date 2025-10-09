
import React, { useState } from "react";
import "./FilterBar.css";
import { validateField } from "../helpers/utils";


export default function ServiceCard({ nome, categoria, onDetalhes, onRemover }) {
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    const nomeError = validateField("nomeServico", nome);
    const categoriaError = validateField("nomeCategoria", categoria);
    setErrors({ nome: nomeError, categoria: categoriaError });
  }, [nome, categoria]);

  return (
    <div className="service-card">
      <div className="service-info">
        <p><strong>Serviço:</strong> {nome}</p>
        {errors.nome && <span style={{ color: "red", fontSize: "0.9em" }}>{errors.nome}</span>}
        <p><strong>Categoria:</strong> {categoria}</p>
        {errors.categoria && <span style={{ color: "red", fontSize: "0.9em" }}>{errors.categoria}</span>}
      </div>
      <div className="service-actions">
        <button className="btn-detalhes" onClick={onDetalhes}>
          DETALHES
        </button>
        <button className="btn-remover" onClick={onRemover}>
          REMOVER
        </button>
      </div>
    </div>
  );
}
