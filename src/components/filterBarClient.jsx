import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import "./FilterBarClient.css";

const statusOptions = [
    { value: "Concluído", color: "#4CAF50", label: "Concluído" },
    { value: "Pendente", color: "#FFC107", label: "Pendente" },
    { value: "Cancelado", color: "#F44336", label: "Cancelado" },
    { value: "Em Atendimento", color: "#2196F3", label: "Em atendimento" },
];

export default function FilterBar({ onSearch, onFilter, onOpenAgendarModal, acaoText }) {
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [status, setStatus] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    const handleApplyFilter = () => {
        if (onFilter) {
            onFilter({
                search: search.trim(),
                dateFrom: dateFrom || null,
                dateTo: dateTo || null,
                status: status || null,
            });
        }
    };

    const clearDates = () => {
        setDateFrom("");
        setDateTo("");
        setStatus("");
        setSearch("");
        if (onFilter) onFilter({ search: "", dateFrom: null, dateTo: null, status: null });
        if (onSearch) onSearch("");
    }

    return (
        <div className="filterbarclient-wrapper">
            <div className="filterbarclient-container">
                <div className="filterbarclient-filter-group">
                    <label className="filterbarclient-filter-label">Buscar por status</label>
                    <div className="filterbarclient-status-indicators">
                        {statusOptions.map((opt) => (
                            <div
                                key={opt.value}
                                className="filterbarclient-status-ball"
                                title={opt.label}
                                onClick={() => setStatus(status === opt.value ? "" : opt.value)}
                                style={{
                                    background: opt.color,
                                    border: status === opt.value ? "1.9px solid #f36c12" : "2px solid transparent",
                                    width: status === opt.value ? "26px" : "18px",
                                    height: status === opt.value ? "26px" : "18px",
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="filterbarclient-filter-group">
                    <label className="filterbarclient-filter-label">Intervalo de datas</label>
                    <div className="filterbarclient-date-range">
                        <input
                            type="date"
                            className="filterbarclient-date-field"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            aria-label="Data inicial"
                        />
                        <span style={{ margin: "0 6px", color: "white", fontWeight: 500, fontSize: "0.75rem" }}>até</span>
                        <input
                            type="date"
                            className="filterbarclient-date-field"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            aria-label="Data final"
                        />
                    </div>
                </div>

                <button onClick={clearDates} className="filterbarclient-clear-dates" title="Limpar intervalo">×</button>

                <button onClick={() => handleApplyFilter()} className="filterbarclient-filter-btn">
                    <Filter size={18} />
                    Filtrar
                </button>
            </div>
            <div className="filterbarclient-action-container">
                <button className="filterbarclient-action-btn" onClick={onOpenAgendarModal}>
                    {acaoText}
                </button>
            </div>
        </div>
    );
}