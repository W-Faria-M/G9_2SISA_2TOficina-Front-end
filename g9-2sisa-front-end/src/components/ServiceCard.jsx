import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import "./FilterBar.css";



export default function ServiceCard({nome, categoria }) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    return (
      

        <div className="service-card">
        <div className="service-info">
            <p><strong>Serviço:</strong> {nome}</p>
            <p><strong>Categoria:</strong> {categoria}</p>
        </div>
        <button className="btn-detalhes">DETALHES</button>
        </div>
    );
}