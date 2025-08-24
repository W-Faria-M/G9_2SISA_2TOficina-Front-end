import "./loginCliente.css";
import loginImage from "../assets/image-login.png"; // ajuste o caminho se necessário

export default function LoginCliente() {
    return (
        <div className="login-cliente-container">
            <div className="login-cliente-image">
                <img src={loginImage} alt="imagem-login" />
            </div>
            <div className="login-cliente-form">
                <h1>2T Oficina</h1>
                <h2>Olá novamente! Faça login e acompanhe seus agendamentos.</h2>
                <div className="login-formCad">
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Senha" />
                </div>
                <div className="login-recuperar">
                    Esqueceu sua senha? Clique <a href="#">aqui</a> para redefini-la.
                </div>
                <button>ENTRAR</button>
                <div className="login-novo">
                    Novo por aqui? Clique <a href="#">aqui</a> e crie sua conta agora.
                </div>
            </div>
        </div>
    );
}