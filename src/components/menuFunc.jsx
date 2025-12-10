import React, { useState } from "react";
import "./menuFunc.css";
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
      window.location.href = "/login-funcionario";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      sessionStorage.removeItem("usuarioId");
      sessionStorage.clear();
      window.location.href = "/login-funcionario";
      console.log("Logout realizado localmente. Houve um problema na comunicação com o servidor.");
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <button className={`hamburger-func ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {isOpen && <div className="overlay-func" onClick={toggleMenu}></div>}

      <div className={`sidebar-func ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header-func">
          <img src={logo} alt="Logo" className="logo-func" />
        </div>

        <ul className="sidebar-menu-func">
          <li><a href="/gestao-agendamentos">Agendamentos</a></li>
          <li><a href="/analises">Dashboard</a></li>
          <li><a href="/servico">Serviços</a></li>
        </ul>

        <button className="logout-func" onClick={handleLogoutClick}>SAIR</button>
      </div>

      <ModalLogout
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        theme="light"
      />
    </>
  );
};

export default MenuHamburguer;
