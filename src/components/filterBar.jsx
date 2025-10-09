import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import "./FilterBar.css";

export default function FilterBar({ onSearch, onFilter, onOpenAgendarModal, acaoText }) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (onSearch) onSearch(e.target.value);
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
                <button onClick={onFilter} className="filter-button">
                    <Filter size={18} />
                    Filtrar
                </button>
            </div>
            <div className="acao-container">
                <button className="acao-button" onClick={onOpenAgendarModal}>{acaoText}</button>
            </div>
        </div>
    );
}
