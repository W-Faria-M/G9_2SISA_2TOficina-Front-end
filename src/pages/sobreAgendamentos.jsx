import React from "react";
import { Link } from "react-router-dom";
import "./sobreAgendamentos.css";

const SobreAgendamento = () => {
  return (
    <div className="agendamento-container">
      {/* Contact Bar */}
      <div className="contact-bar">
        <div className="contact-info">
          <span>📱 (11) 98861-9917</span>
          <span>📧 @2T.OFICINA</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="agendamento-main">
        {/* Como fazer para agendar */}
        <section className="como-agendar">
          <h2 className="titulo-agendar">Como faço para Agendar?</h2>
          <div className="agendar-content">
            <div className="agendar-text">
              <p>
                Para agendar seu atendimento, o primeiro passo é fazer login em
                nossa plataforma. Se ainda não possui uma conta, o cadastro é rápido
                e gratuito. Após acessar sua conta, você poderá escolher o serviço
                desejado, selecionar data e horário de sua preferência e finalizar
                agendamento com poucos cliques.
              </p>
              <Link to="/login-cliente" className="btn-agendar">
                AGENDAR
              </Link>
            </div>
            <div className="passos-grid">
              <div className="passo-item">
                <div className="passo-placeholder">
                  <img src="src/assets/formulário-login.png" alt="Formulário de Login" />
                </div>
                <span>PASSO 1 - FAÇA LOGIN</span>
              </div>
              <div className="passo-item">
                <div className="passo-placeholder">
                  <img src="src\assets\foto_oficina.png" alt="" />
                </div>
                <span>PASSO 2 - ESCOLHA O SERVIÇO</span>
              </div>
              <div className="passo-item">
                <div className="passo-placeholder">
                  {/* Placeholder para próxima imagem */}
                </div>
                <span>PASSO 3 - SELECIONE DATA</span>
              </div>
              <div className="passo-item">
                <div className="passo-placeholder">
                  {/* Placeholder para próxima imagem */}
                </div>
                <span>PASSO 4 - CONFIRME</span>
              </div>
            </div>
          </div>
          <div className="processo-text">
            <p>
              Nosso processo de agendamento foi criado para ser simples e seguro.
              Garantimos que suas informações sejam protegidas e o
              agendamento seja feito de forma personalizável. Seja no horário ou local e
              com atendimento de forma prática e rápida!
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h3>Precisa de um serviço? Agende agora seu atendimento de forma rápida e prática.</h3>
          <Link to="/login-cliente" className="btn-agendar-cta">
            AGENDAR
          </Link>
        </section>

        {/* Contato */}
        <section className="contato-section">
          <h3>Está com dúvidas? Entre em contato:</h3>
          <div className="contato-info">
            <p> Telefone: (11) 98861-9917</p>
            <p>E-mail: contato@2tofi.com</p>
          </div>
        </section>
      </main>

      {/* Footer Contact Bar */}
      <div className="contact__down_bottom">
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
    </div>
  );
};

export default SobreAgendamento;