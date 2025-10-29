import { useEffect, useState } from "react";

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const capacidadeDia = 5;
const statusColors = {
    "Concluído": "#008000", // verde
    "Em Andamento": "#FFA500", // laranja
    "Cancelado": "#FF4500", // vermelho
    "Esperando Atendimento": "#FFD700", // amarelo
    "Aguardando": "#87CEEB", // azul claro
    "default": "#d3d3d3" // cinza
};

function getStatusColor(status) {
    if (status === "Concluído") return statusColors["Concluído"];
    if (status === "Em Andamento") return statusColors["Em Andamento"];
    if (status === "Cancelado") return statusColors["Cancelado"];
    if (status === "Esperando Atendimento") return statusColors["Esperando Atendimento"];
    if (status === "Aguardando") return statusColors["Aguardando"];
    return statusColors["default"];
}

export default function KPI4() {
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        fetch("/db.json")
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
                            return <span key={i} className="kpi4-circle" style={{background: color}}></span>;
                        })}
                    </div>
                </div>
            ))}
            <div className="kpi4-legend">
                <span className="kpi4-legend-circle" style={{background: statusColors["Concluído"]}}></span>Concluído
                <span className="kpi4-legend-circle" style={{background: statusColors["Em Andamento"]}}></span>Em Andamento
                <span className="kpi4-legend-circle" style={{background: statusColors["Cancelado"]}}></span>Cancelado
                <span className="kpi4-legend-circle" style={{background: statusColors["Esperando Atendimento"]}}></span>Aguardando
            </div>
        </div>
    );
}
