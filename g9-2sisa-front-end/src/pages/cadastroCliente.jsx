import "./cadastroCliente.css";

export default function CadastroCliente() {
    return (
        <div className="cadastro-cliente-container">

            <div className="cadastro-cliente-form">
                <h1>2T Oficina</h1>
                <h2>Cadastre-se e acelere seu atendimento!</h2>
                <div className="formCad">
                    <input type="text" placeholder="Nome Completo" /> <input type="text" placeholder="Sobrenome" />
                    <input type="email" placeholder="Email" />
                    <input type="text" placeholder="Telefone" />
                    <input type="password" placeholder="Senha" />
                    <input type="password" placeholder="Confirmar Senha" />
                </div>

                <button>CADASTRAR</button><br /><br />
                <p>Já tem um conta? Clique aqui para fazer login</p>
            </div>

            <div className="cadastro-cliente-image">
                <img src="src/assets/backgroundImageCadastro.png" alt="image-cadastro" />
            </div>

        </div>
    )
}