import React, { useState } from "react";
import "./menu-hamburguer.css";
import logo from "../assets/logo2T.jpg";
import { apiRequest } from "../helpers/utils";
import { ModalLogout } from "./ModalLogout";

const MenuHamburguer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
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
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <button className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <ul className="sidebar-menu">
          <li><a href="/agendamentos-feitos">Agendamentos</a></li>
          <li><a href="/realizar-agendamento">Agendar</a></li>
          <li><a href="/perfil">Perfil</a></li>
        </ul>

        <button className="logout" onClick={handleLogoutClick}>SAIR</button>
      </div>

      <ModalLogout
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        theme="dark"
      />
    </>
  );
};

export default MenuHamburguer;
