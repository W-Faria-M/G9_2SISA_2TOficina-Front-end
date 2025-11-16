import React, { useState } from "react";
import "./menu-hamburguer.css";
import logo from "../assets/logo2T.jpg";
import { apiRequest } from "../helpers/utils";

const MenuHamburguer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      try {
        const usuarioId = sessionStorage.getItem("usuarioId");
        
        if (usuarioId) {
          await apiRequest(`http://localhost:8080/usuarios/logoff?usuarioId=${usuarioId}`, "POST");
        }
        sessionStorage.removeItem("usuarioId");
        sessionStorage.clear(); 
        window.location.href = "/";
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        
        sessionStorage.removeItem("usuarioId");
        sessionStorage.clear();
        window.location.href = "/";
        console.log("Logout realizado localmente. Houve um problema na comunicação com o servidor.");
      }
    }
  };

  return (
    <>
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <ul className="sidebar-menu">
          <li><a href="/gestao-agendamentos">Ver Agendamentos</a></li>
          <li><a href="/analises">Dashboard</a></li>
          <li><a href="/servico">Serviços</a></li>
        </ul>

        <button className="logout" onClick={handleLogout}>SAIR</button>
      </div>
    </>
  );
};

export default MenuHamburguer;
