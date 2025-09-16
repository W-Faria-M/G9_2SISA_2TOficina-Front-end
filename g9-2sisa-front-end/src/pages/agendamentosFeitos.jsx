import React, { useState } from "react";
import FilterBar from "../components/filterBar";
import "./AgendamentosFeitos.css";

export default function AgendamentosFeitos({ onDetalhes }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      veiculo: "Moto (Yamaha MT-07)",
      data: "10/09/2025",
      hora: "14:00",
      tempoEntrega: "16:00",
      status: "Esperando Atendimento",
      servico: "Troca de Óleo",
    },
    {
      id: 2,
      veiculo: "Moto (Honda CB500)",
      data: "08/09/2025",
      hora: "10:00",
      tempoEntrega: "12:00",
      status: "Concluído",
      servico: "Troca de Óleo",
    },
    {
      id: 3,
      veiculo: "Moto (CB 300R)",
      data: "11/09/2025",
      hora: "14:00",
      tempoEntrega: "15:00",
      status: "Esperando Atendimento",
      servico: "Troca de Óleo",
    },
  ]);

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.veiculo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancelar = (id) => {
    setAgendamentos((prev) => prev.filter((ag) => ag.id !== id));
  };

  return (
    <div className="agendamentos-page">
      <h1 className="titulo">Agendamentos</h1>

      <FilterBar
        onSearch={(value) => setSearchTerm(value)}
        onFilter={() => alert("Abrir filtros avançados")}
      />

      <div className="agendamentos-lista">
        {filteredAgendamentos.map((ag) => (
          <div key={ag.id} className="card-agendamento">
            <div className="card-topo">
              <p className="card-veiculo">
                Nº {ag.id} | {ag.veiculo}
              </p>
              <p className="card-data">
                Agendamento {ag.data} - {ag.hora}
              </p>
              <p className="card-entrega">
                Tempo previsto para entrega: {ag.tempoEntrega}
              </p>
            </div>

            <div className="card-lateral">
              <div className="card-status">
                <span
                  className={`status-tag ${
                    ag.status === "Concluído"
                      ? "status-concluido"
                      : "status-pendente"
                  }`}
                >
                  {ag.status}
                </span>
              </div>
              <span className="card-servico">Serviço: {ag.servico}</span>
              <div className="card-acoes">
                <button className="btn-detalhes" onClick={() => onDetalhes(ag)}>
                  Detalhes
                </button>
                {ag.status !== "Concluído" && (
                  <button
                    className="btn-cancelar"
                    onClick={() => handleCancelar(ag.id)}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
