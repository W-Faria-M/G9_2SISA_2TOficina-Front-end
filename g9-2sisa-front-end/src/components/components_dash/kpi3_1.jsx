import { useEffect, useState } from "react";

export default function KPI3_1() {
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        fetch("/db.json")
            .then((res) => res.json())
            .then((data) => {
                setAgendamentos(data.agendamentos || []);
            });
    }, []);

    return (
        <ul className="kpi3-list">
            {agendamentos.map((ag) => (
                <div className="kpi3-value" key={ag.id}>
                    N° {ag.id} | {ag.veiculo} <br />
                    Serviço: {ag.servico} <br />
                    Horário: {ag.hora}
                    <div className="line"></div>
                </div>
            ))}
        </ul>
    );
}