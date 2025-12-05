import React, { useEffect } from 'react';
import './PopupSucesso.css';

const PopupSucesso = ({ mensagem, onClose, darkMode = false }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup-sucesso-overlay">
      <div className={`popup-sucesso-content ${darkMode ? 'dark' : 'light'}`}>
        <div className="popup-sucesso-icone">
          <svg 
            width="50" 
            height="50" 
            viewBox="0 0 60 60" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="4"/>
            <path 
              d="M18 30L26 38L42 22" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="popup-sucesso-texto">
          <h2 className="popup-sucesso-titulo">Sucesso!</h2>
          <p className="popup-sucesso-mensagem">{mensagem}</p>
        </div>
      </div>
    </div>
  );
};

export default PopupSucesso;
