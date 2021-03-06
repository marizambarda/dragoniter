import React, { useState } from 'react';
import api from '../../api';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useAppContext } from '../../AppContext';
import './LoginPage.scss';
import LoadingIndicator from '../../components/LoadingIndicator';

function LoginPage() {
  const { setIsLoggedIn } = useAppContext();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function formSubmitted(e) {
    e.preventDefault();
    setIsLoading(true);
    const response = await api.post(`/users/login`, {
      email: email,
      password: password,
    });
    setIsLoading(false);

    if (response.ok) {
      localStorage.setItem('access_token', response.data.access_token);
      setIsLoggedIn(true);
      history.push('/');
    } else if (response.data) {
      alert(response.data.error);
    } else {
      alert('Ocorreu um erro na comunicação com o servidor.');
    }
  }

  return (
    <Container className="loginPage">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h1>Entrar</h1>
          <Form className="form" onSubmit={formSubmitted}>
            <Form.Group controlId="itemName">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite o email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" disabled={isLoading} size="lg" block>
              {isLoading && <LoadingIndicator small />}
              {isLoading ? ' Entrando' : 'Entrar'}
            </Button>
            <br />
            <div className="text-center">
              <Link to="/forgotpassword" className="forgotPasswordLink">
                Esqueci minha senha
              </Link>
              <br />
              <br />
              <Link to="/users/signup">
                Não tem uma conta? Clique aqui para se cadastrar
              </Link>
              <br />
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
