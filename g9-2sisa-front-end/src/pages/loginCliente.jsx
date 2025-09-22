import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./loginCliente.css";
import loginImage from "../assets/image-login.png";
import { createFormChangeHandler, validateField, apiRequest } from "../helpers/utils";

export default function LoginCliente() {
    const [form, setForm] = useState({ email: "", senha: "" });
    const [error, setError] = useState("");

    const handleChange = createFormChangeHandler(form, setForm, () => setError(""));

    async function handleSubmit(e) {
        e.preventDefault();
        const emailError = validateField("email", form.email);
        const senhaError = validateField("senha", form.senha);
        if (emailError || senhaError) {
            setError(emailError || senhaError || "Preencha todos os campos.");
            return;
        }
        const data = await apiRequest(
            `http://localhost:3001/clientes?email=${encodeURIComponent(form.email)}&senha=${encodeURIComponent(form.senha)}`,
            "GET"
        );
        if (data.length > 0) {
            alert("Login realizado com sucesso!");
        } else {
            setError("Email ou senha inválidos.");
        }
    }

    return (
        <div className="login-cliente-container">
            <div className="login-cliente-image">
                <img src={loginImage} alt="imagem-login" />
            </div>
            <form className="login-cliente-form" onSubmit={handleSubmit}>
                <h1>2T Oficina</h1>
                <h2>Olá novamente! Faça login e acompanhe seus agendamentos.</h2>
                <div className="login-formCad">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={form.senha}
                        onChange={handleChange}
                    />
                </div>
                {error && <div style={{ color: "orange", marginBottom: 10 }}>{error}</div>}
                <div className="login-recuperar">
                    Esqueceu sua senha? Clique <a href="#">aqui</a> para redefini-la.
                </div>
                <button type="submit">ENTRAR</button>
                <div className="login-novo">
                    Novo por aqui? Clique <Link to="/cadastro-cliente" className="link-aqui">aqui</Link> e crie sua conta agora.
                </div>
            </form>
        </div>
    );
}