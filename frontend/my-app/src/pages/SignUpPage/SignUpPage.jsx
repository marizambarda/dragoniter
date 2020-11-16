import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { useAppContext} from "../../AppContext";
import "./SignUpPage.scss";
import LoadingIndicator from "../../components/LoadingIndicator";

function SignUpPage(){
  const {setIsLoggedIn} = useAppContext()
  const history = useHistory();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordConfirmationMismatch, setPasswordConfirmationMismatch] = useState(false)

  const [isLoading, setIsLoading] = useState(false);

  async function formSubmitted(e){
    e.preventDefault()
    if(password !== confirmPassword){
      setPasswordConfirmationMismatch(true)
      return
    }
    setIsLoading(true)
    const response = await api.post(`/users`, {
      name: name,
      nickname: nickname,
      email: email,
      password: password
    })
    setIsLoading(false)

    if (response.ok) {
      localStorage.setItem("access_token", response.data.access_token)
      setIsLoggedIn(true)
      history.push("/")
    } else {
      alert(response.data.error)
    }
  }
  return(
    <Container className="signupPage">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h1>Cadastrar-se</h1>
          <Form className="form" onSubmit={formSubmitted}>
            <Form.Group controlId="itemName">
              <Form.Label>Nome</Form.Label>
              <Form.Control 
                type="name" 
                placeholder="Digite o nome"
                value={name}
                onChange={ e => setName(e.target.value) }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Nome de Usuário
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>@</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl id="inlineFormInputGroupUsername" 
                  placeholder="Digite o nome de usuário" 
                  value={nickname}
                  onChange={ e => setNickname(e.target.value) }/>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Digite o email"
                value={email}
                onChange={ e => setEmail(e.target.value) }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Digite a senha"  
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setPasswordConfirmationMismatch(false)
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirmar a senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirmar a senha"  
                value={confirmPassword}
                isInvalid={passwordConfirmationMismatch}
                onChange={e => {
                  setConfirmPassword(e.target.value)
                  setPasswordConfirmationMismatch(false)
                }}
              />
              <Form.Control.Feedback type="invalid">
                As senhas são diferentes
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              size="lg"
              block
            >
              {isLoading && <LoadingIndicator small />}
              {isLoading ? ' Carregando' : 'Cadastrar'}
            </Button>
            <br />
            <br />
            <Link to="/users/login">Já tem uma conta? Click aqui</Link>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}


export default SignUpPage;