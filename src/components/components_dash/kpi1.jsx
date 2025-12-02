import { useEffect, useState } from "react";

export default function KPI1() {
    const [agendamentosMes, setAgendamentosMes] = useState(0);
    const capacidadeMes = 150; // capacidade fixa

    useEffect(() => {
        fetch("http://localhost:8080/agendamentos/kpi1")
            .then((res) => res.json())
            .then((data) => {
                // Filtra agendamentos do mês atual
                const hoje = new Date();
                const mesAtual = hoje.getMonth() + 1;
                const anoAtual = hoje.getFullYear();
                const agendamentos = (data.agendamentos || []).filter(ag => {
                const dataAg = new Date(ag.dataAgendamento);
                return dataAg.getMonth() + 1 === mesAtual && dataAg.getFullYear() === anoAtual;
         });

                setAgendamentosMes(agendamentos.length);
            });
    }, []);

    return (
        <div className="kpi1-box">
            <h2 className="kpi1-title">Meta Mensal de Serviços:</h2>
            <p className="kpi1-value">{agendamentosMes}/{capacidadeMes} mês</p>
        </div>
    );
}