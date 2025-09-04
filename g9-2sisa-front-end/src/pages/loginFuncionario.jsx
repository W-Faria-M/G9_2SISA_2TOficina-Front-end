import React, { useState } from 'react';
import './loginFuncionario.css';
import logoImage from '../assets/logo2T.jpg'; 

const LoginFuncionario = () => {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.senha) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/funcionarios?email=${encodeURIComponent(form.email)}&senha=${encodeURIComponent(form.senha)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        alert("Login realizado com sucesso!");
        localStorage.setItem("funcionarioLogado", JSON.stringify(data[0]));
        // window.location.href = "/painel-funcionario"; // redirecionamento opcional
      } else {
        setError("Email ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setError("Erro ao conectar com o servidor.");
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