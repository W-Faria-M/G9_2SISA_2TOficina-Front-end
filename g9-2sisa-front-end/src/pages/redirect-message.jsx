import React from 'react';
import './loginFuncionario.css'; 

const RedirectMessage = () => {
  return (
    <div className="redirect-container">
      <div className="message-box">
        <p className="redirect-message">
          "Seu Login foi efetuado com sucesso! <br />
          Você está sendo redirecionado..."
        </p>
      </div>
    </div>
  );
};

export default RedirectMessage;