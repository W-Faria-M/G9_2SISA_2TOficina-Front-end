import React, { useState } from 'react';
import './loginFuncionario.css';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo2T.jpg';
import axios from 'axios';
import { createFormChangeHandler, validateField } from "../helpers/utils";

const LoginFuncionario = () => {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleChange = createFormChangeHandler(form, setForm, () => setError(""));

  async function handleSubmit(e) {
    e.preventDefault();
    const emailError = validateField("email", form.email);
    const senhaError = validateField("senha", form.senha);
    if (emailError || senhaError) {
      setError(emailError || senhaError || "Preencha todos os campos.");
      return;
    }
    try {
      // Chama o endpoint de login do backend
      const response = await axios.post('http://localhost:8080/usuarios/login', {
        email: form.email,
        senha: form.senha
      });

      // A API do backend retorna um objeto tipo LoginRes: { usuarioId: number | null, logado: boolean }
      const data = response.data;
      if (data && data.logado) {
        alert("Login realizado com sucesso!");
        // Armazenamos o objeto de resposta. Se precisar do usuário completo, buscar depois por ID.
        localStorage.setItem("funcionarioLogado", JSON.stringify(data));
        navigate("/servico");
      } else {
        setError("Email ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      if (error.response && error.response.status === 401) {
        setError("Email ou senha inválidos.");
        return;
      }
      const message = error?.response?.data?.message || "Erro ao conectar com o servidor.";
      setError(message);
    }
  }

  return (
    <div className="login-funcionario-body">
      <div className="form-container">
        <img src={logoImage} className="logoa" alt="Logo" />
        <p className="title">Olá novamente! Faça login e acompanhe a Oficina.</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="E-mail"
              name="email"
              value={form.email}
              onChange={handleChange}
              id="email"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              id="senha"
            />
            <div className="forgot">
              <p>
                Esqueceu sua senha? Clique <a rel="noopener noreferrer" href="#">aqui</a> para redefini-la.
              </p>
            </div>
          </div>
          {error && (
            <div style={{ color: "orange", textAlign: "center", marginTop: "10px" }}>
              {error}
            </div>
          )}
          <div className="botao-cadastro">
            <button type="submit" className="sign">LOGIN</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginFuncionario;