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
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    const handleApplyFilter = () => {
        if (onFilter) {
            onFilter({
                search: search.trim(),
                date: date || null,
                status: status || null,
            });
        }
    };

    return (
        <div className="filter-wrapper">
            <div className="filter-bar">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Pesquisar"
                        className="search-input"
                    />
                </div>

                <div className="status-balls">
                    {statusOptions.map((opt) => (
                        <div
                            key={opt.value}
                            className="status-ball"
                            title={opt.label}
                            onClick={() => setStatus(opt.value)}
                            style={{
                                background: opt.color,
                                border:
                                    status === opt.value
                                        ? "1.9px solid #f36c12"
                                        : "2px solid transparent",
                            }}
                        />
                    ))}
                </div>

                <input
                    type="date"
                    className="date-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <button onClick={() => handleApplyFilter()} className="filter-button">
                    <Filter size={18} />
                    Filtrar
                </button>
            </div>

            <div className="acao-container">
                <button className="acao-button" onClick={onOpenAgendarModal}>
                    {acaoText}
                </button>
            </div>
        </div>
    );
}