import React from 'react';
import './loginFuncionario.css';

const Form = () => {
  return (
    <div className="login-funcionario-body">
    <div className="form-container">
        <img src="src/assets/logo2T.jpg" className='logoa ' alt="" />
      <p className="title"> "Olá novamente! Faça login e acompanhe a Oficina."</p>
      <form className="form">
        <div className="input-group">
          <input type="text" placeholder='E-mail' name="username" id="username" />
        </div>
        <div className="input-group">
          <input type="password" name="password" placeholder='Senha' id="password" />
          <div className="forgot">
            <p>“Esqueceu sua senha? Clique <a rel="noopener noreferrer"  href="#">aqui</a> para redefini-la."</p>
          </div>
        </div>
        <div className='botao-cadastro'>
        <button className="sign">CADASTRAR</button>
        </div>
      </form>

    </div>
    </div>
  );
}

export default Form;
