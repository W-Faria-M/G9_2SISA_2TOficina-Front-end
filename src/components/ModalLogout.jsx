import "./ModalLogout.css";

export function ModalLogout({ isOpen, onClose, onConfirm, theme = "dark" }) {
    if (!isOpen) return null;

    return (
        <div className="ctn-logout">
            <div className={`card-logout ${theme}`}>
                <div className="header-logout">
                    <h2>Confirmar Saída</h2>
                </div>
                <p className="text-logout">Tem certeza que deseja sair?</p>
                <div className="buttons-logout">
                    <button className="btn-cancelar-logout" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn-confirmar-logout" onClick={onConfirm}>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}
