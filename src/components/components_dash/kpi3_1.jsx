import { useEffect, useState } from "react";

export default function KPI3_1() {
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        fetch("/db.json")
            .then((res) => res.json())
            .then((data) => {
                const all = data.agendamentos || [];
                // formata data de hoje para dd/mm/yyyy para comparar com os registros
                const today = new Date();
                const dd = String(today.getDate()).padStart(2, "0");
                const mm = String(today.getMonth() + 1).padStart(2, "0");
                const yyyy = today.getFullYear();
                const todayStr = `${dd}/${mm}/${yyyy}`;

                const todays = all.filter((ag) => ag.data === todayStr);
                setAgendamentos(todays);
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