import { useEffect, useState } from "react";
import DetalhesAgendamentoModal from "../DetalhesAgendamentoModal";

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const capacidadeDia = 5;
const statusColors = {
    "Concluído": "#008000", // verde
    "Cancelado": "#E11D48", // vermelho
    "Aguardando": "#FFD700", // amarelo
    "Em Atendimento": "#3B82F6", // azul
    "Pendente": "#FFD700", // amarelo (fallback)
    "default": "#d3d3d3" // cinza
};

function getStatusColor(status) {
    if (status === "Concluído") return statusColors["Concluído"];
    if (status === "Cancelado") return statusColors["Cancelado"];
    if (status === "Em Atendimento") return statusColors["Em Atendimento"];
    if (status === "Aguardando") return statusColors["Aguardando"];
    if (status === "Pendente") return statusColors["Pendente"];
    return statusColors["default"];
}

export default function KPI4() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [selectedAgendamento, setSelectedAgendamento] = useState(null);
    const [loadingDetalhes, setLoadingDetalhes] = useState(false);

    // Busca TODOS os agendamentos do endpoint principal e filtra o desejado
    const buscarAgendamentoCompleto = async (agendamentoId) => {
        try {
            setLoadingDetalhes(true);
            const response = await fetch('http://localhost:8080/agendamentos');
            if (!response.ok) throw new Error('Erro ao buscar agendamentos');
            
            const data = await response.json();
            console.log('[KPI4] Total de agendamentos do backend:', data.length);
            
            // Encontra o agendamento específico pelo ID
            const agendamentoEncontrado = data.find(ag => 
                ag.agendamentoId === agendamentoId || ag.id === agendamentoId
            );
            
            if (!agendamentoEncontrado) {
                console.error('[KPI4] Agendamento não encontrado com ID:', agendamentoId);
                return null;
            }
            
            console.log('[KPI4] Agendamento encontrado do backend:', agendamentoEncontrado);
            
            // Mapear EXATAMENTE igual ao GestaoAgendamentos
            const agendamentoMapeado = {
                id: agendamentoEncontrado.agendamentoId,
                agendamentoId: agendamentoEncontrado.agendamentoId,
                veiculo: agendamentoEncontrado.nomeVeiculo,
                nomeVeiculo: agendamentoEncontrado.nomeVeiculo,
                username: agendamentoEncontrado.nomeCliente,
                nomeCliente: agendamentoEncontrado.nomeCliente,
                usuarioId: agendamentoEncontrado.usuarioId,  // ← CRÍTICO: mapeia corretamente
                data: agendamentoEncontrado.dataAgendamento,
                dataAgendamento: agendamentoEncontrado.dataAgendamento,
                hora: agendamentoEncontrado.horaAgendamento,
                horaAgendamento: agendamentoEncontrado.horaAgendamento,
                horaRetirada: agendamentoEncontrado.horaRetirada,
                status: agendamentoEncontrado.status,
                servico: agendamentoEncontrado.servicos,
                servicos: agendamentoEncontrado.servicos,
                descricao: agendamentoEncontrado.descricao,
                observacao: agendamentoEncontrado.observacao
            };
            
            console.log('[KPI4] Agendamento mapeado com usuarioId:', agendamentoMapeado.usuarioId);
            return agendamentoMapeado;
        } catch (err) {
            console.error('[KPI4] Erro ao buscar agendamento completo:', err);
            return null;
        } finally {
            setLoadingDetalhes(false);
        }
    };

    const handleAbrirDetalhes = async (ag) => {
        if (!ag) return;
        
        const agendamentoId = ag.agendamentoId ?? ag.id;
        console.log('[KPI4] Abrindo detalhes do agendamento:', agendamentoId);
        
        // Busca o agendamento completo do endpoint principal
        const agendamentoCompleto = await buscarAgendamentoCompleto(agendamentoId);
        
        if (agendamentoCompleto) {
            setSelectedAgendamento(agendamentoCompleto);
        } else {
            console.error('[KPI4] Não foi possível carregar o agendamento completo');
        }
    };

    useEffect(() => {
        fetch("http://localhost:8080/agendamentos/kpi4")
            .then(res => res.json())
            .then(data => setAgendamentos(data.agendamentos || []));
    }, []);

    function agendamentosPorDia(diaSemana) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth() + 1;
        const dias = diasSemana.map((dia, idx) => {
            const dataDia = new Date(ano, mes - 1, hoje.getDate() - hoje.getDay() + 1 + idx);
            const dataStr = dataDia.toLocaleDateString("pt-BR");
            const ags = agendamentos.filter(ag => ag.data === dataStr);
            return ags;
        });
        return dias;
    }

    const semanaAgendamentos = agendamentosPorDia(diasSemana);

    return (
        <div className="kpi4-box">
            <h2 className="kpi4-title">CAPACIDADE DA SEMANA:</h2>
            {diasSemana.map((dia, idx) => (
                <div key={dia} className="kpi4-dia-box">
                    <div className="kpi4-dia-label">{dia.toUpperCase()}:</div>
                    <div className="kpi4-circles">
                        {Array.from({length: capacidadeDia}).map((_, i) => {
                            const ag = semanaAgendamentos[idx][i];
                            const color = ag ? getStatusColor(ag.status) : statusColors["default"];
                            const cursorStyle = ag ? { cursor: 'pointer' } : { cursor: 'default' };
                            const vehicleName = ag?.nomeVeiculo ?? ag?.veiculo ?? '';
                            return (
                                <span
                                    key={i}
                                    className="kpi4-circle"
                                    style={{ background: color, ...cursorStyle }}
                                    onClick={() => ag && handleAbrirDetalhes(ag)}
                                    title={ag ? `Ver detalhes: ${vehicleName}` : ''}
                                ></span>
                            );
                        })}
                    </div>
                </div>
            ))}
            <div className="kpi4-legend">
                <span className="kpi4-legend-circle" style={{background: statusColors["Concluído"]}}></span>Concluído
                <span className="kpi4-legend-circle" style={{background: statusColors["Em Atendimento"]}}></span>Em Atendimento
                <span className="kpi4-legend-circle" style={{background: statusColors["Cancelado"]}}></span>Cancelado
                <span className="kpi4-legend-circle" style={{background: statusColors["Pendente"]}}></span>Aguardando
            </div>
            {selectedAgendamento && (
                <DetalhesAgendamentoModal
                    agendamento={selectedAgendamento}
                    onClose={() => setSelectedAgendamento(null)}
                    onUpdate={(updated) => {
                        // keep selected and list in sync when modal updates (e.g., KM)
                        setSelectedAgendamento(updated);
                        setAgendamentos((prev) => prev.map((a) => {
                            // match by common id fields
                            if ((a.agendamentoId && updated.agendamentoId && a.agendamentoId === updated.agendamentoId) ||
                                (a.id && updated.id && a.id === updated.id)) {
                                return { ...a, ...updated };
                            }
                            return a;
                        }));
                    }}
                />
            )}
        </div>
    );
}
