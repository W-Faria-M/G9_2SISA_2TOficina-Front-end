import "./ModalCancelar.css";
import { useState } from "react";

export function ModalCancelar({ isOpen, onClose, onConfirm }) {

    const [inputValue, setInputValue] = useState("");
    const isCancelEnabled = inputValue.toUpperCase() === "CANCELAR";

    const handleConfirm = () => {
        if (isCancelEnabled) {
            onConfirm();
            setInputValue("");
        }
    };

    return (
        <>
            <div className="ctn-cancel">
                <div className="card-cancel">
                    <div className="header-cancel">
                        <h2>Cancelar Agendamento</h2>
                        <button className="btn-fechar" onClick={onClose}>✕</button>
                    </div>
                    <p className="text-cancel">Tem certeza que deseja cancelar este agendamento?</p>
                    <input
                        type="text"
                        placeholder="CANCELAR"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                        maxLength={8}
                    />
                    <p>Lembre-se que será removido permanentemente!</p>
                    <button
                        className="btn-cancelar-confirmar"
                        onClick={handleConfirm}
                        disabled={!isCancelEnabled}
                        style={{
                            backgroundColor: isCancelEnabled ? '#ff0000' : '#8b0000',
                            opacity: isCancelEnabled ? 1 : 0.5,
                            cursor: isCancelEnabled ? 'pointer' : 'not-allowed'
                        }}
                    >
                        CANCELAR
                    </button>
                    {/* <div className="elements-cancel">

                    </div> */}
                </div>
            </div>

        </>
    )
}