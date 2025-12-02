import { useEffect, useState } from "react";
import DetalhesAgendamentoModal from "../DetalhesAgendamentoModal";

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const capacidadeDia = 5;
const statusColors = {
    "Concluído": "#008000", // verde
    "Em Atendimento": "#FFA500", // laranja
    "Cancelado": "#FF4500", // vermelho
    "Pendente": "#FFD700", // amarelo
    "Aguardando": "#87CEEB", // azul claro
    "default": "#d3d3d3" // cinza
};

function getStatusColor(status) {
    if (status === "Concluído") return statusColors["Concluído"];
    if (status === "Em Atendimento") return statusColors["Em Atendimento"];
    if (status === "Cancelado") return statusColors["Cancelado"];
    if (status === "Pendente") return statusColors["Pendente"];
    if (status === "Aguardando") return statusColors["Aguardando"];
    return statusColors["default"];
}

export default function KPI4() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [selectedAgendamento, setSelectedAgendamento] = useState(null);

    // normalize agendamento object to ensure modal finds a usable usuarioId
    const normalizeAg = (ag) => {
        if (!ag) return ag;
        const usuarioId = ag.usuarioId ?? ag.usuario?.id ?? ag.clienteId ?? ag.cliente ?? ag.userId ?? ag.user?.id ?? ag.usuario?.usuarioId ?? null;
        const normalized = { ...ag, usuarioId };
        if (!usuarioId) console.warn('KPI4: usuário não encontrado no agendamento ao abrir modal', ag);
        return normalized;
    };

    // map backend shape to the modal's expected shape
    const mapToModalShape = (ag) => {
        if (!ag) return ag;
        const usuarioId = ag.usuarioId ?? ag.usuario?.id ?? ag.clienteId ?? ag.cliente ?? ag.userId ?? ag.user?.id ?? null;
        const agendamentoId = ag.agendamentoId ?? ag.id ?? ag.codigo ?? null;
        // backend now provides `usuarioNome`, `veiculo`, `servico`, `data`, `hora`
        const nomeVeiculo = ag.nomeVeiculo ?? ag.veiculo ?? ag.veiculoNome ?? '';
        const nomeCliente = ag.nomeCliente ?? ag.usuarioNome ?? ag.username ?? ag.clienteNome ?? ag.cliente ?? '';
        const dataAgendamento = ag.data ?? ag.dataAgendamento ?? '';
        const horaAgendamento = ag.hora ?? ag.horaAgendamento ?? '';
        const horaRetirada = ag.horaRetirada ?? '';
        const servicos = ag.servicos ?? ag.servico ?? '';
        const status = ag.status ?? 'Aguardando';

        return {
            ...ag,
            usuarioId,
            agendamentoId,
            nomeVeiculo,
            nomeCliente,
            dataAgendamento,
            horaAgendamento,
            horaRetirada,
            servicos,
            status,
        };
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
                                    onClick={() => ag && setSelectedAgendamento(mapToModalShape(normalizeAg(ag)))}
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
