import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import "./FilterBar.css";

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
        if (onFilter) onFilter({ search: search.trim(), dateFrom: null, dateTo: null, status: status || null });
    }

    {/* <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Pesquisar"
                        className="search-input"
                    />
                </div> */}

    return (
        <div className="filter-wrapper">
            <h3 className="title-filter">Filtros</h3>

            <div className="filter-bar">

                <div className="filter-group">
                    <label className="filter-label">Buscar por status</label>
                    <div className="container-status">
                        <div className="status-balls">
                            {statusOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className="status-ball"
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
                </div>

                <div className="filter-group">
                    <label className="filter-label">Intervalo de datas</label>
                    <div className="date-range">
                        <input
                            type="date"
                            className="date-input"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                        <span style={{ margin: "0 6px", color: "#555", fontWeight: 500, fontSize: "0.75rem" }}>até</span>
                        <input
                            type="date"
                            className="date-input"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>
                </div>

                <button onClick={clearDates} className="clear-dates">×</button>

                <div className="acao-container">
                    <button className="acao-button" onClick={onOpenAgendarModal}>
                        {acaoText}
                    </button>
                </div>

                <button onClick={handleApplyFilter} className="filter-button">
                    <Filter size={18} />
                    Filtrar
                </button>

            </div>
        </div>

    );
}
