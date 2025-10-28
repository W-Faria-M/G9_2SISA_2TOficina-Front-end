import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DetalhesAgendamentoModal.css";

export default function DetalhesAgendamentoModal({ agendamento, onClose, onUpdate }) {

    console.log("Agendamento completo:", agendamento);
    console.log("Usuario ID:", agendamento?.usuarioId);

    const [km, setKm] = useState("");
    const [kmOriginal, setKmOriginal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingVeiculo, setLoadingVeiculo] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const buscarDadosVeiculo = async () => {
            if (!agendamento?.usuarioId) {
                console.log("usuarioId não encontrado");
                setLoadingVeiculo(false);
                return;
            }

            try {
                console.log("Buscando veículos para usuarioId:", agendamento.usuarioId);
                const response = await axios.get(
                    `http://localhost:8080/veiculos?usuarioId=${agendamento.usuarioId}`
                );

                console.log("Resposta veículos:", response.data);

                if (response.data && response.data.length > 0) {
                    const veiculoAtual = response.data[0];
                    setKm(veiculoAtual.km || 0);
                    setKmOriginal(veiculoAtual.km || 0);
                }
            } catch (err) {
                console.error("Erro ao buscar dados do veículo:", err);
                setError("Erro ao carregar dados do veículo");
            } finally {
                setLoadingVeiculo(false);
            }
        };

        buscarDadosVeiculo();
    }, [agendamento?.usuarioId]);

    if (!agendamento) return null;

    const handleSaveKm = async () => {
        if (!agendamento?.usuarioId) {
            setError("ID do usuário não encontrado");
            return;
        }

        setLoading(true);
        setError("");

        try {
            console.log("Salvando KM para usuarioId:", agendamento.usuarioId);

            // Busca o veículo do usuário
            const veiculosResponse = await axios.get(
                `http://localhost:8080/veiculos?usuarioId=${agendamento.usuarioId}`
            );

            console.log("Veículos encontrados:", veiculosResponse.data);

            if (!veiculosResponse.data || veiculosResponse.data.length === 0) {
                throw new Error("Veículo não encontrado");
            }

            const veiculoId = veiculosResponse.data[0].id;
            console.log("Atualizando veículo ID:", veiculoId, "com KM:", km);

            // Atualiza o KM do veículo
            const response = await axios.patch(
                `http://localhost:8080/veiculos/atualizar-campo/${veiculoId}`,
                { km: Number(km) },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setKmOriginal(Number(km));
                if (onUpdate) {
                    onUpdate({ ...agendamento, km: Number(km) });
                }
                alert("KM atualizado com sucesso!");
            }
        } catch (err) {
            console.error("Erro ao atualizar KM:", err);
            console.error("Detalhes:", err.response?.data);
            setError(err.response?.data?.message || "Erro ao atualizar KM");
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
                                Nº {agendamento.agendamentoId} | {agendamento.nomeVeiculo}
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
                                            disabled={loading}
                                            title="Salvar KM"
                                        >
                                            {loading ? "..." : "✓"}
                                        </button>
                                    </>
                                )}
                            </div>

                            {error && (
                                <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-texto">
                                Cliente: {agendamento.nomeCliente || 'Não informado'}
                            </p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-texto">
                                Agendado em: {agendamento.dataAgendamento || 'Não informado'}
                            </p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-texto">
                                Hora de início: {agendamento.horaAgendamento || 'Não informado'}
                            </p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-texto">
                                Hora de retirada: {agendamento.horaRetirada || 'Não informada'}
                            </p>
                        </div>
                    </div>

                    <div className="detalhes-coluna-direita">
                        <div className="detalhes-modal-info">
                            <p className="detalhes-label">Serviços:</p>
                            <ul className="detalhes-lista">
                                {agendamento.servicos ? (
                                    agendamento.servicos.split(', ').map((servico, index) => (
                                        <li key={index}>• {servico}</li>
                                    ))
                                ) : (
                                    <li>• Nenhum serviço informado</li>
                                )}
                            </ul>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-status-label">
                                Status: <span className="detalhes-status-valor">{agendamento.status || 'Não informado'}</span>
                            </p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-label">Descrição:</p>
                            <p className="detalhes-texto">
                                {agendamento.descricao || 'Sem descrição'}
                            </p>
                        </div>

                        <div className="detalhes-modal-info">
                            <p className="detalhes-label">Observação:</p>
                            <p className="detalhes-texto">
                                {agendamento.observacao || 'Sem observações'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}