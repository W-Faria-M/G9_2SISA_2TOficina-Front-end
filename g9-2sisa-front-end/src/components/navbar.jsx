import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo2t from "../assets/logo2T.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo2t} alt="Logo 2T Oficina" />
      </div>

      {/* Menu Desktop */}
      <ul className="navbar__center">
        <li><Link to="/">Início</Link></li>
        <li><Link to="/quem-somos">Quem Somos</Link></li>
        <li><Link to="/servicos">Serviços</Link></li>
        <li><Link to="/contato">Contato</Link></li>
      </ul>

      <div className="navbar__right">
        <Link to="/agendamentos-feitos">Agendamento</Link>
        <span className="navbar__separator">|</span>
        <Link to="/login-cliente">Login</Link>
        <span className="navbar__separator">|</span>
        <Link to="/cadastro-cliente" className="cadastro">Cadastro</Link>
      </div>

      {/* Botão Hamburger (aparece só no mobile) */}
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menu Mobile */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/">Início</Link>
        <Link to="/quem-somos">Quem Somos</Link>
        <Link to="/servicos">Serviços</Link>
        <Link to="/contato">Contato</Link>
        <Link to="/agendamentos-feitos">Agendamento</Link>
        <Link to="/login-cliente">Login</Link>
        <Link to="/cadastro-cliente" className="cadastro">Cadastro</Link>
      </div>

      {/* Barra de Contato (fixa abaixo da navbar) */}
      <div className="contact__down">
        <div className="contact__down-content">
          <a
            href="https://wa.me/5511988619917"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__whatsapp"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="contact__icon"
            />
            <span>(11) 98861-9917</span>
          </a>
          <a
            href="https://instagram.com/2t.oficina"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__instagram"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
              alt="Instagram"
              className="contact__icon"
            />
            <span>@2T.OFICINA</span>
          </a>
        </div>
      </div>
    </nav>
  );
}