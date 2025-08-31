import React, { useState } from "react";
import "./cadastroCliente.css";

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

    function validate() {
        const newErrors = {};

        if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
        if (!form.sobrenome.trim()) newErrors.sobrenome = "Sobrenome é obrigatório";

        if (!form.email.trim()) {
            newErrors.email = "Email é obrigatório";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
            newErrors.email = "Email inválido";
        }

        if (!form.telefone.trim()) {
            newErrors.telefone = "Telefone é obrigatório";
        } else if (!/^\d{8,}$/.test(form.telefone)) {
            newErrors.telefone = "Telefone inválido";
        }

        if (!form.senha) {
            newErrors.senha = "Senha é obrigatória";
        } else if (form.senha.length < 4) {
            newErrors.senha = "Senha deve ter pelo menos 4 caracteres";
        }

        if (!form.confirmarSenha) {
            newErrors.confirmarSenha = "Confirme sua senha";
        } else if (form.senha !== form.confirmarSenha) {
            newErrors.confirmarSenha = "As senhas não coincidem";
        }

        return newErrors;
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await fetch("http://localhost:3001/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: form.nome,
                sobrenome: form.sobrenome,
                email: form.email,
                telefone: form.telefone,
                senha: form.senha
            })
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
    }

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
                <p>Já tem um conta? Clique aqui para fazer login</p>
            </form>
            <div className="cadastro-cliente-image">
                <img src="src/assets/backgroundImageCadastro.png" alt="image-cadastro" />
            </div>
        </div>
    );
}