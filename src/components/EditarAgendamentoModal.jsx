import React, { useState } from "react";
import "./EditarAgendamentoModal.css";
import { Calendar, Settings, User } from "lucide-react";

export default function EditarAgendamentoModal({ agendamento, onClose }) {
    const [formData, setFormData] = useState({
        veiculo: agendamento?.veiculo || "",
        cliente: agendamento?.username || "",
        data: agendamento?.data || "",
        hora: agendamento?.hora || "",
        horaRetirada: agendamento?.horaRetirada || "",
        status: agendamento?.status || "",
        servico: agendamento?.servico || "",
        descricao: agendamento?.descricao || "",
        observacao: agendamento?.observacao || ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                data: formData.data,
                hora: formData.hora,
                horaRetirada: formData.horaRetirada,
                descricao: formData.descricao,
                observacao: formData.observacao,
                statusAgendamento: {
                    id: getStatusId(formData.status)
                }
            };

            console.log('Enviando payload:', payload);

            const response = await fetch(`http://localhost:8080/agendamentos/atualizar-campo/${agendamento.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar: ${errorText}`);
            }

            alert('Agendamento atualizado com sucesso!');
            onClose();
            window.location.reload();
        } catch (err) {
            console.error('Erro ao atualizar:', err);
            alert('Erro ao atualizar agendamento: ' + err.message);
        }
    };

    const getStatusId = (statusNome) => {
        const statusMap = {
            'Pendente': 1,
            'Em Atendimento': 2,
            'Concluído': 3,
            'Cancelado': 4
        };
        return statusMap[statusNome] || 1;
    };

    const handleExcluir = () => {
        console.log('Tentando excluir agendamento com ID:', agendamento.id);
        if (window.confirm("Deseja realmente excluir este agendamento?")) {
            fetch(`http://localhost:8080/agendamentos/${agendamento.id}`, {
                method: 'DELETE',
            })
                .then(async response => {
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Erro ao excluir agendamento: ${errorText}`);
                    }
                    alert('Agendamento excluído com sucesso!');
                    onClose();
                    window.location.reload();
                })
                .catch(err => {
                    console.error('Erro ao excluir:', err);
                    alert(err.message);
                });
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
                        {/* <label className="editar-label">Veículo:</label> */}
                        <input
                            type="text"
                            name="veiculo"
                            value={formData.veiculo}
                            onChange={handleChange}
                            placeholder="Nº X | Moto (Marca e Modelo) | KM: ** | Placa ABC 1234"
                            className="editar-input editar-input-destaque"
                            disabled
                        />
                    </div>

                    <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Cliente:</label>
                        <input
                            type="text"
                            name="cliente"
                            value={formData.cliente}
                            className="editar-input-inline"
                            disabled
                        />
                    </div>

                    <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Data de início:</label>
                        <div className="datepicker-wrapper">
                            <input
                                type="date"
                                name="data"
                                value={formData.data}
                                onChange={handleChange}
                                className="editar-input-inline"
                            />
                            <button
                                type="button"
                                className="editar-icon-btn"
                                onClick={() => document.querySelector('input[name="data"]').showPicker()}
                            >
                                <Calendar size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="editar-form-row-horas">
                        <div className="editar-form-group-hora">
                            <label className="editar-label">Hora:</label>
                            <input
                                type="time"
                                name="hora"
                                value={formData.hora}
                                onChange={handleChange}
                                className="editar-input-inline editar-input-hora"
                            />
                        </div>

                        <div className="editar-form-group-hora">
                            <label className="editar-label">Hora Retirada:</label>
                            <input
                                type="time"
                                name="horaRetirada"
                                value={formData.horaRetirada}
                                onChange={handleChange}
                                className="editar-input-inline editar-input-hora"
                            />
                        </div>
                    </div>

                    {/* <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="editar-input-inline"
                        >
                            <option value="Pendente">Pendente</option>
                            <option value="Em Atendimento">Em Atendimento</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        <button type="button" className="editar-icon-btn">
                            <Settings size={20} />
                        </button>
                    </div> */}
                    
                    <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Adicionar observação:</label>
                        <textarea
                            className="ipt-observacao"
                            name="observacao"
                            value={formData.observacao}
                            onChange={handleChange}
                            rows="2"
                        />
                    </div>

                    <div className="editar-form-group editar-form-row">
                        <label className="editar-label">Serviços:</label>
                        <input
                            type="text"
                            name="servico"
                            value={formData.servico}
                            className="editar-input-inline"
                            disabled
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