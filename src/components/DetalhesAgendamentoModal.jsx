import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DetalhesAgendamentoModal.css";

export default function DetalhesAgendamentoModal({ agendamento, onClose, onUpdate }) {
    console.log("Agendamento completo:", agendamento);

    const [km, setKm] = useState("");
    const [kmOriginal, setKmOriginal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingVeiculo, setLoadingVeiculo] = useState(true);
    const [error, setError] = useState("");
    const [veiculoId, setVeiculoId] = useState(null);

    useEffect(() => {
        const buscarDadosVeiculo = async () => {
            setLoadingVeiculo(true);
            setError("");
            setVeiculoId(null);
            setKm("");

            if (!agendamento) {
                setLoadingVeiculo(false);
                return;
            }

            const usuarioId = agendamento.usuarioId ?? agendamento.usuario?.id ?? agendamento.clienteId ?? agendamento.cliente;
            console.log("usuarioId detectado:", usuarioId);

            if (!usuarioId && usuarioId !== 0) {
                setError("ID do usuário não encontrado no agendamento.");
                setLoadingVeiculo(false);
                return;
            }

            try {
                const resp = await axios.get(`http://localhost:8080/veiculos?usuarioId=${usuarioId}`);
                console.log("GET /veiculos?usuarioId= resp:", resp.status, resp.data);

                if (resp.data && resp.data.length > 0) {
                    const veiculo = resp.data[0];
                    const idFromView = veiculo.veiculoId ?? veiculo.id ?? null;
                    setVeiculoId(idFromView);
                    setKm(veiculo.km ?? "");
                    setKmOriginal(veiculo.km ?? 0);
                    console.log("Veículo carregado:", { idFromView, km: veiculo.km, veiculo });
                } else {
                    setError("Nenhum veículo encontrado para este usuário.");
                }
            } catch (err) {
                console.error("Erro ao buscar veículo:", err, err.response?.data);
                setError("Erro ao carregar dados do veículo.");
            } finally {
                setLoadingVeiculo(false);
            }
        };

        buscarDadosVeiculo();
    }, [agendamento]);

    if (!agendamento) return null;

    const handleSaveKm = async () => {
        setError("");
        const kmNumber = Number(km);
        if (isNaN(kmNumber) || kmNumber < 0) {
            setError("KM inválido.");
            return;
        }

        if (!veiculoId && veiculoId !== 0) {
            setError("Veículo não encontrado para esse agendamento (veiculoId undefined).");
            return;
        }

        setLoading(true);
        try {
            console.log("DEBUG: patch - veiculoId:", veiculoId, "kmNumber:", kmNumber);
            const response = await axios.patch(
                `http://localhost:8080/veiculos/atualizar-campo/${veiculoId}`,
                { km: kmNumber },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("DEBUG: patch response:", response.status, response.data);
            if (response.status === 200) {
                setKmOriginal(kmNumber);
                if (onUpdate) onUpdate({ ...agendamento, km: kmNumber });
                alert("KM atualizado com sucesso!");
            } else {
                setError("Erro ao atualizar KM.");
            }
        } catch (err) {
            console.error("Erro ao atualizar KM:", err, err.response?.data);
            setError(err.response?.data?.message || JSON.stringify(err.response?.data) || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="detalhes-modal-overlay" onClick={onClose}>
            <div className="detalhes-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="detalhes-modal-close" onClick={onClose}>✕</button>

                <h2 className="detalhes-modal-titulo">Detalhes</h2>

                <div className="detalhes-modal-body">
                    <div className="detalhes-coluna-esquerda">
                        <div className="detalhes-modal-info">
                            <p className="detalhes-label">
                                Nº {agendamento.agendamentoId ?? agendamento.id} | {agendamento.nomeVeiculo ?? agendamento.veiculo}
                            </p>
                            <div className="detalhes-km">
                                {loadingVeiculo ? (
                                    <span>Carregando...</span>
                                ) : (
                                    <>
                                        <input
                                            type="number"
                                            value={km}
                                            onChange={(e) => setKm(e.target.value)}
                                            className="detalhes-km-input"
                                            placeholder="0"
                                            min="0"
                                            disabled={loading}
                                        />
                                        <span>Km</span>
                                        <button
                                            className="detalhes-save-icon"
                                            onClick={handleSaveKm}
                                            disabled={loading || loadingVeiculo}
                                            title="Salvar KM"
                                        >
                                            {loading ? "..." : "✓"}
                                        </button>
                                    </>
                                )}
                            </div>

                            {error && <p style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{error}</p>}
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-texto">Cliente: {agendamento.nomeCliente ?? agendamento.username ?? "Não informado"}</p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-texto">Agendado em: {agendamento.dataAgendamento ?? agendamento.data ?? "Não informado"}</p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-texto">Hora de início: {agendamento.horaAgendamento ?? agendamento.hora ?? "Não informado"}</p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-texto">Hora de retirada: {agendamento.horaRetirada ?? "Não informada"}</p>
                        </div>
                    </div>

                    <div className="detalhes-coluna-direita">
                        <div className="detalhes-modal-info">
                            <p className="detalhes-label">Serviços:</p>
                            <ul className="detalhes-lista">
                                {(agendamento.servicos ?? agendamento.servico) ? (
                                    (agendamento.servicos ?? agendamento.servico).split(", ").map((s, i) => <li key={i}>• {s}</li>)
                                ) : (
                                    <li>• Nenhum serviço informado</li>
                                )}
                            </ul>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-status-label">Status: <span className="detalhes-status-valor">{agendamento.status ?? "Não informado"}</span></p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-label">Descrição:</p>
                            <p className="detalhes-texto">{agendamento.descricao ?? "Sem descrição"}</p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-label">Observação:</p>
                            <p className="detalhes-texto">{agendamento.observacao ?? "Sem observações"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}