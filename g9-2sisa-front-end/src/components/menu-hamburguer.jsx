import React, { useState } from "react";
import "./menu-hamburguer.css";
import logo from "../assets/logo2T.jpg";

const MenuHamburguer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
          <li><a href="/agendamentos">Agendamentos</a></li>
          <li><a href="/analises">Análises</a></li>
          <li><a href="/servicos">Serviços</a></li>
        </ul>

        <button className="logout">SAIR</button>
      </div>
    </>
  );
};

export default MenuHamburguer;
