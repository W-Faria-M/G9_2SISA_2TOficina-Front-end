import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./loginCliente.css";
import loginImage from "../assets/image-login.png";
import ModalTransicao from "../components/ModalTransicao";
import { createFormChangeHandler, validateField, apiRequest } from "../helpers/utils";

export default function LoginCliente() {
    const [form, setForm] = useState({ email: "", senha: "" });
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            const data = await apiRequest(
                "http://localhost:8080/usuarios/login",
                "POST",
                { email: form.email, senha: form.senha }
            );
            if (data.logado == true) {
                sessionStorage.setItem("usuarioId", data.usuarioId);

                setIsModalOpen(true);

                setTimeout(() => {
                    setIsModalOpen(false);
                    window.location.href = "/agendamentos-feitos";
                }, 3000);


            }
        } catch (error) {
            if (error.message.includes("401")) {
                setError("Email ou senha inválidos.");
            } else {
                setError("Erro inesperado. Tente novamente.");
            }
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

            <ModalTransicao
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tipo="login"
            />
        </div>
    );
}