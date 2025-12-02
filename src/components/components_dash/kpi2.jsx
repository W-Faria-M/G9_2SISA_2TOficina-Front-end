import { useEffect, useState } from "react";

export default function KPI2() {
    const [ocupacao, setOcupacao] = useState(0);
    const capacidade = 5; // capacidade fixa

    useEffect(() => {
       fetch("http://localhost:8080/agendamentos/kpi2")
            .then((res) => res.json())
            .then((data) => {
                setOcupacao((data.agendamentos || []).length);
            });
    }, []);

    return (
        <div className="kpi1-box">
            <h2 className="kpi1-title">Motos paradas na oficina:</h2>
            <p className="kpi1-value">{ocupacao}/{capacidade} motos</p>
        </div>
    );
}