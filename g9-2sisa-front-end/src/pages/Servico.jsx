import { useState } from "react";
import FilterBar from "../components/filterBar";
import ServiceCard from "../components/ServiceCard";
import CategoriaCard from "../components/CategoriaCard";
import "./Servico.css";

export default function AgendamentosFeitos() {
  const [activeTab, setActiveTab] = useState("servicos");
  const [services] = useState([
    { id: 1, nome: "Troca de óleo", status: "Ativo", categoria: "Manutenção Preventiva" },
    { id: 2, nome: "Troca de Pneus", status: "Inativo", categoria: "Pneus e Rodas" },
    { id: 3, nome: "Substituição de Velas", status: "Ativo", categoria: "Manutenção Corretiva" },
  ]);

  const categorias = [...new Set(services.map(s => s.categoria))];

  return (
    <div className="servico-page">
      {/* Abas */}
      <div className="ABAS">
        <div className={activeTab === "servicos" ? "select" : "no-select"}>
          <button onClick={() => setActiveTab("servicos")}>SERVIÇOS</button>
        </div>
        <div className={activeTab === "categorias" ? "select" : "no-select"}>
          <button onClick={() => setActiveTab("categorias")}>CATEGORIAS</button>
        </div>
      </div>

      {/* Barra de filtro aparece em qualquer aba */}
      <FilterBar
        onSearch={(value) => console.log("Pesquisar:", value)}
        onFilter={() => alert("Abrir filtros avançados")}
      />

      {/* Conteúdo */}
      <div className="services-container">
        {activeTab === "servicos" &&
          services.map((s) => (
            <ServiceCard key={s.id} nome={s.nome} categoria={s.categoria} />
          ))
        }

        {activeTab === "categorias" &&
          categorias.map((cat, i) => (
            <CategoriaCard key={i} nome={cat} />
          ))
        }
      </div>
    </div>
  );
}
