import React from "react";
import "./FilterBar.css";

export default function ServiceCard({ nome, categoria, onDetalhes }) {
  return (
    <div className="service-card">
      <div className="service-info">
        <p><strong>Serviço:</strong> {nome}</p>
        <p><strong>Categoria:</strong> {categoria}</p>
      </div>
      <button className="btn-detalhes" onClick={onDetalhes}>
        DETALHES
      </button>
    </div>
  );
}
