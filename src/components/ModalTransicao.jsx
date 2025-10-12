import { useEffect, useState } from 'react';
import './ModalTransicao.css';
import motoIcon from '../assets/moto-icon.png'

export default function ModalTransicao({ isOpen, onClose, mensagem }) {
    const [showMoto, setShowMoto] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setShowMoto(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className='container-card'>
            <div className='card-father'>
                <p>Seu cadastro foi realizado com sucesso! Você será redirecionado à página de Login...</p>

                <div className="moto-container">
                    <img 
                    src={motoIcon} 
                    alt="Moto"
                    className={`moto ${showMoto ? 'moto-animate' : ''}`} />
                </div>

                <div className="road"></div>
            </div>
        </div>
    );
}