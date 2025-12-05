import React, { useState, useEffect } from 'react';
import './cadastroAgendamento.css';
import { validateForm, createFormChangeHandler, apiRequest } from "../helpers/utils";
import PopupSucesso from './PopupSucesso';
import PopupErro from './PopupErro';

export default function CadastroAgendamento({ onSuccess }) {
  const [form, setForm] = useState({
    veiculo: '',
    data: '',
    hora: '',
    servico: '',
  });
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [errorServicos, setErrorServicos] = useState(null);
  const [errors, setErrors] = useState({});
  const [popupSucesso, setPopupSucesso] = useState({ show: false, mensagem: "" });
  const [popupErro, setPopupErro] = useState({ show: false, mensagem: "" });

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await apiRequest('http://localhost:3001/servicos', 'GET');
        setServicosDisponiveis(data);
      } catch (error) {
        setErrorServicos('Erro ao carregar serviços: ' + error.message);
        console.error('Erro ao carregar serviços:', error);
      } finally {
        setLoadingServicos(false);
      }
    };
    fetchServicos();
  }, []);

  const fieldsToValidate = ["veiculo", "data", "hora", "servico"];
  const handleChange = createFormChangeHandler(form, setForm, setErrors);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form, fieldsToValidate);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const newAgendamento = {
        ...form,
        tempoEntrega: 'A definir',
        status: 'Esperando Atendimento',
      };
      await apiRequest('http://localhost:3001/agendamentos', 'POST', newAgendamento);
      setPopupSucesso({ show: true, mensagem: "Agendamento realizado com sucesso!" });
      setForm({
        veiculo: '',
        data: '',
        hora: '',
        servico: '',
      });
      setErrors({});
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao cadastrar agendamento:', error);
      setPopupErro({ show: true, mensagem: "Não foi possível realizar o agendamento. Tente novamente." });
    }
  };

  if (loadingServicos) {
    return <div className="cadastro-agendamento-container">Carregando serviços...</div>;
  }

  if (errorServicos) {
    return <div className="cadastro-agendamento-container" style={{ color: 'red' }}>{errorServicos}</div>;
  }

  return (
    <div className="cadastro-agendamento-container">
      <form className="cadastro-agendamento-form" onSubmit={handleSubmit} noValidate>
        <h1>Agendar Serviço</h1>
        <div className="form-group">
          <label htmlFor="veiculo">Veículo:</label>
          <input
            type="text"
            id="veiculo"
            name="veiculo"
            value={form.veiculo}
            onChange={handleChange}
            placeholder="Ex: Honda CB 500"
          />
          {errors.veiculo && <span className="error-message">{errors.veiculo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="data">Data:</label>
          <input
            type="date"
            id="data"
            name="data"
            value={form.data}
            onChange={handleChange}
          />
          {errors.data && <span className="error-message">{errors.data}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="hora">Hora:</label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={form.hora}
            onChange={handleChange}
          />
          {errors.hora && <span className="error-message">{errors.hora}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="servico">Serviço:</label>
          <select
            id="servico"
            name="servico"
            value={form.servico}
            onChange={handleChange}
          >
            <option selected disabled value="">Selecione um serviço</option>
            {servicosDisponiveis.map((servico) => (
              <option key={servico.id} value={servico.nome}>
                {servico.nome}
              </option>
            ))}
          </select>
          {errors.servico && <span className="error-message">{errors.servico}</span>}
        </div>

        <button type="submit">Agendar</button>
      </form>

      {popupSucesso.show && (
        <PopupSucesso
          mensagem={popupSucesso.mensagem}
          onClose={() => {
            setPopupSucesso({ show: false, mensagem: "" });
            if (onSuccess) onSuccess();
          }}
          darkMode={false}
        />
      )}
      {popupErro.show && (
        <PopupErro
          mensagem={popupErro.mensagem}
          onClose={() => setPopupErro({ show: false, mensagem: "" })}
          darkMode={false}
        />
      )}
    </div>
  );
}
