import React from "react";
import "./navbar.css";
import logo2t from "../assets/logo2T.jpg";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo2t} alt="Logo 2T Oficina" />
      </div>
      <ul className="navbar__center">
        <li><a href="#">Início</a></li>
        <li><a href="#">Quem Somos</a></li>
        <li><a href="#">Serviços</a></li>
        <li><a href="#">Contato</a></li>
      </ul>
      <div className="navbar__right">
        <a href="#">Agendamento</a>
        <span className="navbar__separator">|</span>
        <a href="#">Login</a>
        <span className="navbar__separator">|</span>
        <a href="#" className="cadastro">Cadastro</a>
      </div>


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