import { useEffect, useState } from "react";

export default function KPI2() {
    const [ocupacao, setOcupacao] = useState(0);
    const capacidade = 5; // capacidade fixa

    useEffect(() => {
        fetch("/db.json")
            .then((res) => res.json())
            .then((data) => {
                // Filtra agendamentos do dia atual
                const hoje = new Date().toLocaleDateString("pt-BR");
                const agendamentosHoje = (data.agendamentos || []).filter(ag => ag.data === hoje);
                setOcupacao(agendamentosHoje.length);
            });
    }, []);

    return (
        <div className="kpi1-box">
            <h2 className="kpi1-title">Ocupação Atual:</h2>
            <p className="kpi1-value">{ocupacao}/{capacidade} motos</p>
        </div>
    );
}