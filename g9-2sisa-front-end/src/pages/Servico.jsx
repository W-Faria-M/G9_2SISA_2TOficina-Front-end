import React, { useState, useEffect } from "react";
import FilterBar from "../components/filterBar";
import ServiceCard from "../components/ServiceCard";
import CategoriaCard from "../components/CategoriaCard";
import PopupServico from "../components/PopupServico";
import DetalhesServico from "../components/DetalhesServico";
import PopupCategoria from "../components/PopupCategoria";
import "./Servico.css";
import { apiRequest } from "../helpers/utils";

export default function Servico() {
  const [activeTab, setActiveTab] = useState("servicos");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupAddServiceOpen, setIsPopupAddServiceOpen] = useState(false);
  const [isPopupAddCategoryOpen, setIsPopupAddCategoryOpen] = useState(false);
  const [isPopupEditServiceOpen, setIsPopupEditServiceOpen] = useState(false); // Novo estado para edição de serviço
  const [isPopupEditCategoryOpen, setIsPopupEditCategoryOpen] = useState(false); // Novo estado para edição de categoria
  const [isDetalhesServiceOpen, setIsDetalhesServiceOpen] = useState(false); // Novo estado para detalhes de serviço
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesData, categoriesData] = await Promise.all([
        apiRequest("http://localhost:3001/servicos", "GET"),
        apiRequest("http://localhost:3001/categorias", "GET"),
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error) {
      setError("Erro ao carregar dados: " + error.message);
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddServico = async (novoServico) => {
    try {
      const serviceToAdd = {
        nome: novoServico.nome,
        categoria: novoServico.categoria,
        rapido: novoServico.rapido === "true",
        status: novoServico.ativo === "true" ? "Ativo" : "Inativo",
        descricao: novoServico.descricao,
      };
      await apiRequest("http://localhost:3001/servicos", "POST", serviceToAdd);
      alert("Serviço adicionado com sucesso!");
      setIsPopupAddServiceOpen(false);
      fetchData();
    } catch (error) {
      setError("Erro ao adicionar serviço: " + error.message);
      console.error("Erro ao adicionar serviço:", error);
      alert("Erro ao adicionar serviço.");
    }
  };

  const handleEditServico = async (servicoEditado) => {
    try {
      await apiRequest(`http://localhost:3001/servicos/${servicoEditado.id}`, "PUT", servicoEditado);
      alert("Serviço atualizado com sucesso!");
      setIsPopupEditServiceOpen(false);
      setSelectedService(null);
      fetchData();
    } catch (error) {
      setError("Erro ao atualizar serviço: " + error.message);
      console.error("Erro ao atualizar serviço:", error);
      alert("Erro ao atualizar serviço.");
    }
  };

  const handleDeleteServico = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      await apiRequest(`http://localhost:3001/servicos/${id}`, "DELETE");
      alert("Serviço excluído com sucesso!");
      fetchData();
    } catch (error) {
      setError("Erro ao excluir serviço: " + error.message);
      console.error("Erro ao excluir serviço:", error);
      alert("Erro ao excluir serviço.");
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      await apiRequest("http://localhost:3001/categorias", "POST", { nome: newCategory.nome });
      alert("Categoria adicionada com sucesso!");
      setIsPopupAddCategoryOpen(false);
      fetchData();
    } catch (error) {
      setError("Erro ao adicionar categoria: " + error.message);
      console.error("Erro ao adicionar categoria:", error);
      alert("Erro ao adicionar categoria.");
    }
  };

  const handleEditCategory = async (editedCategory) => {
    try {
      await apiRequest(`http://localhost:3001/categorias/${editedCategory.id}`, "PUT", editedCategory);
      alert("Categoria atualizada com sucesso!");
      setIsPopupEditCategoryOpen(false);
      setSelectedCategory(null);
      fetchData();
    } catch (error) {
      setError("Erro ao atualizar categoria: " + error.message);
      console.error("Erro ao atualizar categoria:", error);
      alert("Erro ao atualizar categoria.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria? Isso pode afetar serviços associados.")) return;
    try {
      await apiRequest(`http://localhost:3001/categorias/${id}`, "DELETE");
      alert("Categoria excluída com sucesso!");
      fetchData();
    } catch (error) {
      setError("Erro ao excluir categoria: " + error.message);
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria.");
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((category) =>
    category.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEditService = (service) => {
    setSelectedService(service);
    setIsPopupEditServiceOpen(true);
    setIsDetalhesServiceOpen(false); // Garante que o modal de detalhes não esteja aberto
  };

  const handleOpenDetalhesService = (service) => {
    setSelectedService(service);
    setIsDetalhesServiceOpen(true);
    setIsPopupEditServiceOpen(false); // Garante que o modal de edição não esteja aberto
  };

  const handleOpenEditCategory = (category) => {
    setSelectedCategory(category);
    setIsPopupEditCategoryOpen(true);
  };

  if (loading) {
    return <div className="servico-page">Carregando serviços e categorias...</div>;
  }

  if (error) {
    return <div className="servico-page" style={{ color: 'red' }}>{error}</div>;
  }

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
        searchValue={searchTerm}
        onSearch={value => setSearchTerm(value)}
        onFilter={() => alert("Abrir filtros avançados")}
        onOpenAgendarModal={() =>
          activeTab === "servicos"
            ? setIsPopupAddServiceOpen(true)
            : setIsPopupAddCategoryOpen(true)
        }
        acaoText={activeTab === "servicos" ? "Novo Serviço" : "Nova Categoria"}
      />

      {/* Conteúdo */}
      <div className="services-container">
        {activeTab === "servicos" &&
          filteredServices.map((s) => (
            <ServiceCard
              key={s.id}
              nome={s.nome}
              categoria={s.categoria}
              onDetalhes={() => handleOpenDetalhesService(s)}
              onRemover={() => handleDeleteServico(s.id)}
            />
          ))
        }

        {activeTab === "categorias" &&
          filteredCategories.map((cat) => (
            <CategoriaCard key={cat.id} nome={cat.nome} onEditar={() => handleOpenEditCategory(cat)} onRemover={() => handleDeleteCategory(cat.id)} />
          ))
        }
      </div>

      {/* Popup de adicionar serviço */}
    <PopupServico
      isOpen={isPopupAddServiceOpen}
      onClose={() => setIsPopupAddServiceOpen(false)}
      onConfirm={handleAddServico}
      availableCategories={categories}
      initialData={null}
    />

    {/* Popup de editar serviço */}
    <PopupServico
      isOpen={isPopupEditServiceOpen}
      onClose={() => { setIsPopupEditServiceOpen(false); setSelectedService(null); }}
      onConfirm={handleEditServico}
      availableCategories={categories}
      initialData={selectedService}
    />

    {/* Popup de adicionar categoria */}
    <PopupCategoria
      isOpen={isPopupAddCategoryOpen}
      onClose={() => setIsPopupAddCategoryOpen(false)}
      onConfirm={handleAddCategory}
      initialData={null}
    />

    {/* Popup de editar categoria */}
    <PopupCategoria
      isOpen={isPopupEditCategoryOpen}
      onClose={() => { setIsPopupEditCategoryOpen(false); setSelectedCategory(null); }}
      onConfirm={handleEditCategory}
      initialData={selectedCategory}
    />

    {/* Popup de detalhes do serviço */}
    <DetalhesServico
      isOpen={isDetalhesServiceOpen}
      onClose={() => { setIsDetalhesServiceOpen(false); setSelectedService(null); }}
      servico={selectedService}
      onEditar={handleOpenEditService}
    />
  </div>
  );
}
