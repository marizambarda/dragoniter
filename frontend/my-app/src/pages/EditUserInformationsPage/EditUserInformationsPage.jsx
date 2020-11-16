import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useAppContext } from '../../AppContext';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Button,
  Alert,
} from 'react-bootstrap';
import LoadingIndicator from '../../components/LoadingIndicator';
import PageWithMenu from '../../components/PageWithMenu';

function EditUserInformationsPage() {
  const { loggedUser } = useAppContext();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [
    passwordConfirmationMismatch,
    setPasswordConfirmationMismatch,
  ] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loggedUser) {
      setName(loggedUser.name);
      setEmail(loggedUser.email);
      setNickname(loggedUser.nickname);
    }
  }, [loggedUser]);

  async function formSubmited(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordConfirmationMismatch(true);
      return;
    }
    setShowSuccessMessage(false);

    const data = {
      name: name,
      nickname: nickname,
      email: email,
    };
    if (password !== '') {
      data.password = password;
    }
    setIsLoading(true);
    const response = await api.put(`/me`, data);
    setIsLoading(false);
    if (response.ok) {
      setShowSuccessMessage(true);
    } else {
      alert(response.data.error);
    }
  }
  return (
    <Container>
      <PageWithMenu>
        <div className="pagePadding">
          <h1 className="pageTitle  editUserPage">Editar dados de usuário</h1>
          {showSuccessMessage && (
            <Alert variant={'success'}>Dados atualizados com sucesso!</Alert>
          )}
          <Form className="form" onSubmit={formSubmited}>
            <Form.Group controlId="itemName">
              <Row>
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label>Nome de Usuário</Form.Label>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        id="inlineFormInputGroupUsername"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={12}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={false}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label>Confirmar a senha</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      isInvalid={passwordConfirmationMismatch}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordConfirmationMismatch(false);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      As senhas são diferentes
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading && <LoadingIndicator small />}
              {isLoading ? ' Atualizando' : 'Atualizar'}
            </Button>
          </Form>
        </div>
      </PageWithMenu>
    </Container>
  );
}

export default EditUserInformationsPage;
