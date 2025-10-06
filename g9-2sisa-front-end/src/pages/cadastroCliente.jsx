import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./cadastroCliente.css";
import {
    validateForm,
    createFormChangeHandler,
    createFormSubmitHandler,
    apiRequest
} from "../helpers/utils";

export default function CadastroCliente() {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: ""
  });
  const [errors, setErrors] = useState({});

  const fieldsToValidate = [
    "nome",
    "sobrenome",
    "email",
    "telefone",
    "senha",
    "confirmarSenha"
  ];

  const handleChange = createFormChangeHandler(form, setForm, setErrors);

  const onSubmitCallback = async (formState) => {
    await apiRequest("http://localhost:3001/clientes", "POST", {
      nome: formState.nome,
      sobrenome: formState.sobrenome,
      email: formState.email,
      telefone: formState.telefone,
      senha: formState.senha
    });
    alert("Cadastro realizado!");
    setForm({
      nome: "",
      sobrenome: "",
      email: "",
      telefone: "",
      senha: "",
      confirmarSenha: ""
    });
    setErrors({});
  };

  const handleSubmit = createFormSubmitHandler(form, setErrors, onSubmitCallback, fieldsToValidate);

    return (
        <div className="cadastro-cliente-container">
            <form className="cadastro-cliente-form" onSubmit={handleSubmit} noValidate>
                <h1>2T Oficina</h1>
                <h2>Cadastre-se e acelere seu atendimento!</h2>
                <div className="formCad">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome Completo"
                        value={form.nome}
                        onChange={handleChange}
                    />
                    {errors.nome && <span style={{ color: "orange" }}>{errors.nome}</span>}
                    <input
                        type="text"
                        name="sobrenome"
                        placeholder="Sobrenome"
                        value={form.sobrenome}
                        onChange={handleChange}
                    />
                    {errors.sobrenome && <span style={{ color: "orange" }}>{errors.sobrenome}</span>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span style={{ color: "orange" }}>{errors.email}</span>}
                    <input
                        type="text"
                        name="telefone"
                        placeholder="Telefone"
                        value={form.telefone}
                        onChange={handleChange}
                    />
                    {errors.telefone && <span style={{ color: "orange" }}>{errors.telefone}</span>}
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={form.senha}
                        onChange={handleChange}
                    />
                    {errors.senha && <span style={{ color: "orange" }}>{errors.senha}</span>}
                    <input
                        type="password"
                        name="confirmarSenha"
                        placeholder="Confirmar Senha"
                        value={form.confirmarSenha}
                        onChange={handleChange}
                    />
                    {errors.confirmarSenha && <span style={{ color: "orange" }}>{errors.confirmarSenha}</span>}
                </div>
                <button type="submit">CADASTRAR</button><br /><br />
                <p>
                    Já tem uma conta? Clique <Link to="/login-cliente" className="link-aqui">aqui</Link> para fazer login.
                </p>
            </form>
            <div className="cadastro-cliente-image">
                <img src="src/assets/backgroundImageCadastro.png" alt="image-cadastro" />
            </div>
        </div>
    );
}