import React, { useEffect } from 'react';
import './PopupErro.css';

const PopupErro = ({ mensagem, onClose, darkMode = false }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup-erro-overlay">
      <div className={`popup-erro-content ${darkMode ? 'dark' : 'light'}`}>
        <div className="popup-erro-icone">
          <svg 
            width="50" 
            height="50" 
            viewBox="0 0 60 60" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="4"/>
            <path 
              d="M22 22L38 38M38 22L22 38" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="popup-erro-texto">
          <h2 className="popup-erro-titulo">Erro!</h2>
          <p className="popup-erro-mensagem">{mensagem}</p>
        </div>
      </div>
    </div>
  );
};

export default PopupErro;
