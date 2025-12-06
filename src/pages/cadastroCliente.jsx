import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModalTransicao from "../components/ModalTransicao";
import EmailVerificationModal from "../components/EmailVerificationModal";
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [pendingForm, setPendingForm] = useState(null);
    const [sendingCode, setSendingCode] = useState(false);

    const inputStyle = { color: '#000' };


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
            // generate a numeric verification code, send it to the verification API
            setSendingCode(true);
            const generateCode = () => {
                // 6-digit numeric code
                return Math.floor(100000 + Math.random() * 900000).toString();
            };

            const verificationCode = generateCode();

            const sendResp = await fetch('http://localhost:5000/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formState.email, name: `${formState.nome} ${formState.sobrenome}`, code: verificationCode }),
            });
            const sendData = await sendResp.json().catch(() => ({}));
            if (!sendResp.ok || !sendData.success) {
                const msg = sendData.error || sendData.message || 'Falha ao enviar código de verificação.';
                setError({ general: String(msg) });
                setSendingCode(false);
                return;
            }

            // open verification modal and keep form data pending until verification
            setPendingForm({ ...formState, verificationCode });
            setIsVerificationOpen(true);
            setSendingCode(false);
        } catch (error) {
            console.error('Erro ao solicitar código de verificação:', error);
            setError({ general: 'Erro de rede ao solicitar código. Tente novamente.' });
            setSendingCode(false);
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
                        style={inputStyle}
                    />
                    {error.nome && <span style={{ color: "orange" }}>{error.nome}</span>}
                    <input
                        type="text"
                        name="sobrenome"
                        placeholder="Sobrenome"
                        value={form.sobrenome}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {error.sobrenome && <span style={{ color: "orange" }}>{error.sobrenome}</span>}
                    <input
                        type="text"
                        name="telefone"
                        placeholder="Telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {error.telefone && <span style={{ color: "orange" }}>{error.telefone}</span>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {error.email && <span style={{ color: "orange" }}>{error.email}</span>}
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={form.senha}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {error.senha && <span style={{ color: "orange" }}>{error.senha}</span>}
                    <input
                        type="password"
                        name="confirmarSenha"
                        placeholder="Confirmar Senha"
                        value={form.confirmarSenha}
                        onChange={handleChange}
                        style={inputStyle}
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

            <ModalTransicao
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tipo="cadastro"
            />
            <EmailVerificationModal
                isOpen={isVerificationOpen}
                onClose={() => { setIsVerificationOpen(false); setPendingForm(null); }}
                email={form.email}
                name={`${form.nome} ${form.sobrenome}`}
                expectedCode={pendingForm?.verificationCode}
                sendUrl={'http://localhost:5000/send-verification'}
                onSent={async (data) => {
                    // when verification succeeded, create the user with pendingForm
                    try {
                        if (!pendingForm) return;
                        const create = await apiRequest('http://localhost:8080/usuarios', 'POST', {
                            tipoUsuario: { id: 1 },
                            nome: pendingForm.nome,
                            sobrenome: pendingForm.sobrenome,
                            telefone: pendingForm.telefone,
                            email: pendingForm.email,
                            senha: pendingForm.senha
                        });
                        console.log('Usuário criado:', create);
                        // clear and show transition then redirect
                        setForm({ nome: '', sobrenome: '', telefone: '', email: '', senha: '', confirmarSenha: '' });
                        setPendingForm(null);
                        setIsVerificationOpen(false);
                        setIsModalOpen(true);
                        setTimeout(() => { window.location.href = '/login-cliente'; }, 2000);
                    } catch (err) {
                        console.error('Erro ao criar usuário após verificação:', err);
                        setError({ general: 'Erro ao criar usuário após verificação.' });
                    }
                }}
            />
        </div>
    );
}