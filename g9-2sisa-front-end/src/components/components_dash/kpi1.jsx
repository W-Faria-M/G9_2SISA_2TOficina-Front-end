import { useEffect, useState } from "react";

export default function KPI1() {
    const [agendamentosMes, setAgendamentosMes] = useState(0);
    const capacidadeMes = 150; // capacidade fixa

    useEffect(() => {
        fetch("/db.json")
            .then((res) => res.json())
            .then((data) => {
                // Filtra agendamentos do mês atual
                const hoje = new Date();
                const mesAtual = hoje.getMonth() + 1;
                const anoAtual = hoje.getFullYear();
                const agendamentos = (data.agendamentos || []).filter(ag => {
                    const [dia, mes, ano] = ag.data.split("/").map(Number);
                    return mes === mesAtual && ano === anoAtual;
                });
                setAgendamentosMes(agendamentos.length);
            });
    }, []);

    return (
        <div className="kpi1-box">
            <h2 className="kpi1-title">Capacidade de Serviços:</h2>
            <p className="kpi1-value">{agendamentosMes}/{capacidadeMes} mês</p>
        </div>
    );
}