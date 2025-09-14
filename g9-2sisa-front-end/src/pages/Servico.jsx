import { useState } from "react";
import FilterBar from "../components/filterBar";
import ServiceCard from "../components/ServiceCard";
import CategoriaCard from "../components/CategoriaCard";
import PopupServico from "../components/PopupServico";
import DetalhesServico from "../components/DetalhesServico"; // ✅ novo popup
import "./Servico.css";

export default function AgendamentosFeitos() {
  const [activeTab, setActiveTab] = useState("servicos");
  const [services, setServices] = useState([
    {
      id: 1,
      nome: "Troca de óleo",
      status: "Ativo",
      categoria: "Manutenção Preventiva",
      rapido: true,
      descricao: "Troca do óleo do motor para manter a lubrificação correta."
    },
    {
      id: 2,
      nome: "Troca de Pneus",
      status: "Inativo",
      categoria: "Pneus e Rodas",
      rapido: false,
      descricao: "Substituição de pneus com balanceamento incluso."
    },
    {
      id: 3,
      nome: "Substituição de Velas",
      status: "Ativo",
      categoria: "Manutenção Corretiva",
      rapido: true,
      descricao: "Troca de velas para melhor desempenho do motor."
    },
  ]);

  const [isPopupAddOpen, setIsPopupAddOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null); // ✅ serviço clicado

  const categorias = [...new Set(services.map(s => s.categoria))];

  // Função para adicionar novo serviço
  const handleAddServico = (novoServico) => {
    setServices([
      ...services,
      {
        id: services.length + 1,
        nome: novoServico.nome,
        categoria: novoServico.categoria,
        rapido: novoServico.rapido === "true",
        ativo: novoServico.ativo,
        descricao: novoServico.descricao,
        status: novoServico.ativo ? "Ativo" : "Inativo"
      }
    ]);
  };

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

      {/* Botão para abrir popup de adicionar */}
      {activeTab === "servicos" && (
        <button className="adicionar-button" onClick={() => setIsPopupAddOpen(true)}>
          + Adicionar
        </button>
      )}

      {/* Barra de filtro aparece em qualquer aba */}
      <FilterBar
        onSearch={(value) => console.log("Pesquisar:", value)}
        onFilter={() => alert("Abrir filtros avançados")}
      />

      {/* Conteúdo */}
      <div className="services-container">
        {activeTab === "servicos" &&
          services.map((s) => (
            <ServiceCard
              key={s.id}
              nome={s.nome}
              categoria={s.categoria}
              onDetalhes={() => setSelectedService(s)} // ✅ abre popup de detalhes
            />
          ))
        }

        {activeTab === "categorias" &&
          categorias.map((cat, i) => (
            <CategoriaCard key={i} nome={cat} />
          ))
        }
      </div>

      {/* Popup de adicionar serviço */}
      <PopupServico
        isOpen={isPopupAddOpen}
        onClose={() => setIsPopupAddOpen(false)}
        onConfirm={handleAddServico}
      />

      {/* Popup de detalhes */}
      <DetalhesServico
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        servico={selectedService}
      />
    </div>
  );
}
