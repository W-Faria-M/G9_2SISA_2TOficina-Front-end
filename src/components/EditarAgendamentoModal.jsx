import React, { useState } from "react";
import "./EditarAgendamentoModal.css";
import { Calendar, Settings, User } from "lucide-react";

export default function EditarAgendamentoModal({ agendamento, onClose, onSave }) {
    const [formData, setFormData] = useState({
        veiculo: agendamento?.veiculo || "",
        cliente: agendamento?.username || "",
        dataInicio: agendamento?.data || "",
        status: agendamento?.status || "",
        servico: agendamento?.servico || ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...agendamento, ...formData });
        onClose();
    };

    const handleExcluir = () => {
        if (window.confirm("Deseja realmente excluir este agendamento?")) {
            onClose();
        }
    };

    if (!agendamento) return null;

    return (
        <div className="editar-modal-overlay" onClick={onClose}>
            <div className="editar-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="editar-modal-close" onClick={onClose}>✕</button>

                <h2 className="editar-modal-titulo">Alterar informações</h2>

                <form onSubmit={handleSubmit} className="editar-modal-form">
                    <div className="editar-form-group">
                        <input
                            type="text"
                            name="veiculo"
                            value={formData.veiculo}
                            onChange={handleChange}
                            placeholder="Nº X | Moto (Marca e Modelo) | KM: ** | Placa ABC 1234"
                            className="editar-input editar-input-destaque"
                        />
                    </div>

                    <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Cliente:</label>
                        <input
                            type="text"
                            name="cliente"
                            value={formData.cliente}
                            onChange={handleChange}
                            className="editar-input-inline"
                        />
                    </div>

                    <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Data de início:</label>
                        <input
                            type="date"
                            name="dataInicio"
                            value={formData.dataInicio}
                            onChange={handleChange}
                            className="editar-input-inline"
                        />
                        <button type="button" className="editar-icon-btn">
                            <Calendar size={20} />
                        </button>
                    </div>

                    <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Status:</label>
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="editar-input-inline"
                        />
                        <button type="button" className="editar-icon-btn">
                            <Settings size={20} />
                        </button>
                    </div>

                    <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Serviços:</label>
                        <input
                            type="text"
                            name="servico"
                            value={formData.servico}
                            onChange={handleChange}
                            className="editar-input-inline"
                        />
                        <button type="button" className="editar-icon-btn">
                            <User size={20} />
                        </button>
                    </div>

                    <div className="editar-modal-actions">
                        <button
                            type="button"
                            className="editar-btn editar-btn-excluir"
                            onClick={handleExcluir}
                        >
                            Excluir
                        </button>
                        <button
                            type="submit"
                            className="editar-btn editar-btn-salvar"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}