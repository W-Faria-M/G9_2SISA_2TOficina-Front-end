import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./cadastroCliente.css";
import {
    createFormChangeHandler,
    createFormSubmitHandler,
    apiRequest
} from "../helpers/utils";

export default function CadastroCliente() {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });
  const [error, setError] = useState({});

  const fieldsToValidate = [
    "nome",
    "sobrenome",
    "telefone",
    "email",
    "senha",
    "confirmarSenha"
  ];

  const handleChange = createFormChangeHandler(form, setForm, setError);

  const onSubmitCallback = async (formState) => {
    try {
      const data =await apiRequest("http://localhost:8080/usuarios", "POST", {
        tipoUsuario: {id: 1},
        nome: formState.nome,
        sobrenome: formState.sobrenome,
        telefone: formState.telefone,
        email: formState.email,
        senha: formState.senha
      });
      alert(`Cadastro realizado! Seja bem-vindo(a) ${data.nome}.`);
      setForm({
        nome: "",
        sobrenome: "",
        telefone: "",
        email: "",
        senha: "",
        confirmarSenha: ""
      });
      window.location.href = "/login-cliente";
    setError({});
    } catch (error) {
        if (error.message.includes("400")) {
            setError({ email: "Email já cadastrado." });
        } else {
            console.error("Erro ao cadastrar cliente:", error);
        }
    }
  };

  const handleSubmit = createFormSubmitHandler(form, setError, onSubmitCallback, fieldsToValidate);

    return (
        <div className="cadastro-cliente-container">
            <form className="cadastro-cliente-form" onSubmit={handleSubmit} noValidate>
                <h1>2T Oficina</h1>
                <h2>Cadastre-se e acelere seu atendimento!</h2>
                <div className="formCad">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={handleChange}
                    />
                    {error.nome && <span style={{ color: "orange" }}>{error.nome}</span>}
                    <input
                        type="text"
                        name="sobrenome"
                        placeholder="Sobrenome"
                        value={form.sobrenome}
                        onChange={handleChange}
                    />
                    {error.sobrenome && <span style={{ color: "orange" }}>{error.sobrenome}</span>}
                    <input
                        type="text"
                        name="telefone"
                        placeholder="Telefone"
                        value={form.telefone}
                        onChange={handleChange}
                    />
                    {error.telefone && <span style={{ color: "orange" }}>{error.telefone}</span>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {error.email && <span style={{ color: "orange" }}>{error.email}</span>}
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={form.senha}
                        onChange={handleChange}
                    />
                    {error.senha && <span style={{ color: "orange" }}>{error.senha}</span>}
                    <input
                        type="password"
                        name="confirmarSenha"
                        placeholder="Confirmar Senha"
                        value={form.confirmarSenha}
                        onChange={handleChange}
                    />
                    {error.confirmarSenha && <span style={{ color: "orange" }}>{error.confirmarSenha}</span>}
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