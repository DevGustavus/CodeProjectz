import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import ambiente from './../ambiente.js';


function SignUpPage() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const clearFields = () => {
    setPassword('');
    setPasswordRepeat('');
  };

  const validateEmailDomain = (email) => {
    const allowedDomains = ['@estudante.iftm.edu.br', '@iftm.edu.br'];
    return allowedDomains.some(domain => email.endsWith(domain));
  };

  const validateFields = () => {
    if (!nome || !sobrenome || !email || !dataNascimento || !password || !passwordRepeat) {
      setErrorMessage('Todos os campos são obrigatórios.');
      clearFields();
      return false;
    }

    if (!validateEmailDomain(email)) {
      setErrorMessage('O e-mail deve ser do domínio @estudante.iftm.edu.br ou @iftm.edu.br.');
      clearFields();
      return false;
    }

    if (password !== passwordRepeat) {
      setErrorMessage('As senhas não coincidem.');
      clearFields();
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleCadastro = (event) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }

    const userData = {
      nome: nome,
      sobrenome: sobrenome,
      email: email,
      dataNascimento: dataNascimento,
      senha: password,
    };

    axios
      .post(`${ambiente.localHost}/usuario`, userData)
      .then((response) => {
        console.log('Usuário cadastrado com sucesso:', response.data);
        navigate('/'); // Redireciona para a página de login
      })
      .catch((error) => {
        setErrorMessage('Erro ao cadastrar usuário. Tente novamente mais tarde.');
        clearFields();
      });
  };

  return (
    <div className="container">
      <div className="left-section">{/* Espaço para uma imagem ou outro conteúdo */}</div>
      <div className="right-section">
        <h1 className="login-title">Cadastro</h1>
        <form className="login-form" onSubmit={handleCadastro}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
          <input
            type="date"
            placeholder="Data de Nascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Repetir Senha"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
          />
          <div className="botoes">
            <button type="submit">Cadastrar</button>
            <button type="button" onClick={() => navigate('/')}>Voltar</button> {/* Botão Voltar */}
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Exibe mensagem de erro se houver */}
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;