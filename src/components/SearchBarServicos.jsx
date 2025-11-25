import React, { useState } from "react";
import { Search } from "lucide-react";
import "./FilterBar.css";

export default function SearchBarServicos({ onSearch, onOpenModal, acaoText }) {
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
            </div>

            <div className="acao-container">
                <button className="acao-button" onClick={onOpenModal}>
                    {acaoText}
                </button>
            </div>
        </div>
    );
}
