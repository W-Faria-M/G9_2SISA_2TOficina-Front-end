import React from "react";
import "./Perfil.css";

const Perfil = () => {
  return (
    <div className="perfil-container">
      <h2>Perfil</h2>
      <p className="subtitulo">Personalize sua experiência</p>

      <div className="perfil-content">
        {/* Coluna esquerda - Informações */}
        <div className="perfil-info">
          <h3>Suas Informações</h3>
          <div className="foto-container">
            <img
              src="/default-avatar.png"
              alt="Foto do usuário"
              className="foto-usuario"
            />
            <span className="editar-foto">✏️</span>
          </div>
          <p className="nome">nome dos Santos Silva</p>
          <p className="email">nome@email.com</p>
          <p className="telefone">Telefone: +55 (11) 9 4002 - 8922</p>
          <p className="endereco">Endereço: Ainda não adicionado</p>
          <button className="btn-editar">EDITAR</button>
        </div>

        {/* Coluna direita */}
        <div className="perfil-dados">
          <div className="cards-servicos">
            <div className="card">
              <h4>Serviços a serem realizados:</h4>
              <span className="numero">1</span>
              <button className="btn-secundario">AGENDAMENTOS</button>
            </div>
            <div className="card">
              <h4>Serviços já realizados:</h4>
              <span className="numero">2</span>
              <button className="btn-primario">+ AGENDAR</button>
            </div>
          </div>

          {/* Lista de motos */}
          <div className="motos-section">
            <h3>Suas Motos</h3>
            <div className="lista-motos">
              <div className="moto-card">
                <p>Marca: Nome Marca</p>
                <p>Modelo: Nome Modelo</p>
                <p>Ano: AAAA</p>
                <p>Km: X km</p>
                <p>Placa: ABC 1234</p>
              </div>
              <div className="moto-card">
                <p>Marca: Nome Marca</p>
                <p>Modelo: Nome Modelo</p>
                <p>Ano: AAAA</p>
                <p>Km: X km</p>
                <p>Placa: XYZ 0987</p>
              </div>
            </div>

            <div className="acoes-motos">
              <button className="btn-adicionar">ADICIONAR</button>
              <button className="btn-remover">REMOVER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
