import React, { useState, useEffect } from "react";
import SearchBarServicos from "../components/SearchBarServicos";
import ServiceCard from "../components/ServiceCard";
import CategoriaCard from "../components/CategoriaCard";
import PopupServico from "../components/PopupServico";
import DetalhesServico from "../components/DetalhesServico";
import PopupCategoria from "../components/PopupCategoria";
import PopupSucesso from "../components/PopupSucesso";
import PopupErro from "../components/PopupErro";
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
  const [popupSucesso, setPopupSucesso] = useState({ show: false, mensagem: "" });
  const [popupErro, setPopupErro] = useState({ show: false, mensagem: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesData, categoriesData] = await Promise.all([
        apiRequest("http://localhost:8080/servicos/completos", "GET"),
        apiRequest("http://localhost:8080/servicos/categorias", "GET"),
      ]);
      
      // Mapeia os dados da API para o formato esperado pelo frontend
      const mappedServices = servicesData.map(servico => ({
        id: servico.servicoId,
        nome: servico.nomeServico,
        categoria: servico.nomeCategoria,
        descricao: servico.descricao,
        rapido: servico.ehRapido,
        status: servico.status,
        ativo: servico.status === "Ativo"
      }));
      
      setServices(mappedServices);
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
      // Encontra o id da categoria selecionada
      const categoriaSelecionada = categories.find(cat => cat.nome === novoServico.categoria);
      
      const serviceToAdd = {
        nome: novoServico.nome,
        categoriaServico: {
          id: categoriaSelecionada?.id
        },
        descricao: novoServico.descricao,
        ehRapido: novoServico.rapido === true,
        statusServico: {
          id: novoServico.ativo === true ? 1 : 2
        }
      };
      
      await apiRequest("http://localhost:8080/servicos", "POST", serviceToAdd);
      setPopupSucesso({ show: true, mensagem: "Serviço adicionado com sucesso!" });
      setIsPopupAddServiceOpen(false);
      fetchData();
    } catch (error) {
      setError("Erro ao adicionar serviço: " + error.message);
      console.error("Erro ao adicionar serviço:", error);
      setPopupErro({ show: true, mensagem: "Não foi possível adicionar o serviço. Tente novamente." });
    }
  };

  const handleEditServico = async (servicoEditado) => {
    try {
      // Encontra o id da categoria selecionada
      const categoriaSelecionada = categories.find(cat => cat.nome === servicoEditado.categoria);
      
      const serviceToUpdate = {
        nome: servicoEditado.nome,
        categoriaServico: {
          id: categoriaSelecionada?.id
        },
        descricao: servicoEditado.descricao,
        ehRapido: servicoEditado.rapido === "true" || servicoEditado.rapido === true,
        statusServico: {
          id: servicoEditado.ativo === true ? 1 : 2
        }
      };
      
      await apiRequest(`http://localhost:8080/servicos/atualizar-campo/${servicoEditado.id}`, "PATCH", serviceToUpdate);
      setPopupSucesso({ show: true, mensagem: "Serviço atualizado com sucesso!" });
      setIsPopupEditServiceOpen(false);
      setSelectedService(null);
      fetchData();
    } catch (error) {
      setError("Erro ao atualizar serviço: " + error.message);
      console.error("Erro ao atualizar serviço:", error);
      setPopupErro({ show: true, mensagem: "Não foi possível atualizar o serviço. Tente novamente." });
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      await apiRequest("http://localhost:8080/servicos/categorias", "POST", { nome: newCategory.nome });
      setPopupSucesso({ show: true, mensagem: "Categoria adicionada com sucesso!" });
      setIsPopupAddCategoryOpen(false);
      fetchData();
    } catch (error) {
      setError("Erro ao adicionar categoria: " + error.message);
      console.error("Erro ao adicionar categoria:", error);
      setPopupErro({ show: true, mensagem: "Não foi possível adicionar a categoria. Tente novamente." });
    }
  };

  const handleEditCategory = async (editedCategory) => {
    try {
      await apiRequest(`http://localhost:8080/servicos/categorias/${editedCategory.id}`, "PUT", { nome: editedCategory.nome });
      setPopupSucesso({ show: true, mensagem: "Categoria atualizada com sucesso!" });
      setIsPopupEditCategoryOpen(false);
      setSelectedCategory(null);
      fetchData();
    } catch (error) {
      setError("Erro ao atualizar categoria: " + error.message);
      console.error("Erro ao atualizar categoria:", error);
      setPopupErro({ show: true, mensagem: "Não foi possível atualizar a categoria. Tente novamente." });
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
    return (
      <div className="servico-page">
        <div className="servico-sem-resultados">
          <p>Carregando dados...</p>
          <p>Por favor, aguarde enquanto buscamos os serviços e categorias.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="servico-page">
        <div className="servico-sem-resultados" style={{ borderColor: '#e74c3c' }}>
          <p style={{ color: '#e74c3c' }}>Erro ao carregar dados</p>
          <p>{error}</p>
          <p>Tente recarregar a página ou entre em contato com o suporte se o problema persistir.</p>
        </div>
      </div>
    );
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

      <div className="content-wrapper">
        {/* Barra de pesquisa simplificada */}
        <SearchBarServicos
          onSearch={value => setSearchTerm(value)}
          onOpenModal={() =>
            activeTab === "servicos"
              ? setIsPopupAddServiceOpen(true)
              : setIsPopupAddCategoryOpen(true)
          }
          acaoText={activeTab === "servicos" ? "Novo Serviço" : "Nova Categoria"}
        />

        {/* Conteúdo */}
        <div className="services-container">
        {activeTab === "servicos" && (
          filteredServices.length === 0 ? (
            services.length === 0 ? (
              <div className="servico-sem-resultados">
                <p>Nenhum serviço cadastrado no sistema.</p>
                <p>Os serviços aparecerão listados aqui quando forem criados.</p>
                <p>Use o botão "Novo Serviço" acima para adicionar o primeiro serviço!</p>
              </div>
            ) : (
              <div className="servico-sem-resultados">
                <p>Nenhum serviço encontrado para a pesquisa.</p>
                <p>Tente pesquisar com termos diferentes.</p>
              </div>
            )
          ) : (
            filteredServices.map((s) => (
              <ServiceCard
                key={s.id}
                nome={s.nome}
                categoria={s.categoria}
                onDetalhes={() => handleOpenDetalhesService(s)}
              />
            ))
          )
        )}

        {activeTab === "categorias" && (
          filteredCategories.length === 0 ? (
            categories.length === 0 ? (
              <div className="servico-sem-resultados">
                <p>Nenhuma categoria cadastrada no sistema.</p>
                <p>As categorias aparecerão listadas aqui quando forem criadas.</p>
                <p>Use o botão "Nova Categoria" acima para adicionar a primeira categoria!</p>
              </div>
            ) : (
              <div className="servico-sem-resultados">
                <p>Nenhuma categoria encontrada para a pesquisa.</p>
                <p>Tente pesquisar com termos diferentes.</p>
              </div>
            )
          ) : (
            filteredCategories.map((cat) => (
              <CategoriaCard key={cat.id} nome={cat.nome} onEditar={() => handleOpenEditCategory(cat)} />
            ))
          )
        )}
      </div>
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

    {popupSucesso.show && (
      <PopupSucesso
        mensagem={popupSucesso.mensagem}
        onClose={() => setPopupSucesso({ show: false, mensagem: "" })}
        darkMode={false}
      />
    )}
    {popupErro.show && (
      <PopupErro
        mensagem={popupErro.mensagem}
        onClose={() => setPopupErro({ show: false, mensagem: "" })}
        darkMode={false}
      />
    )}
    </div>
  );
}
