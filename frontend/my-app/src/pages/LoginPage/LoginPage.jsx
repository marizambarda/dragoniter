import React, { useState } from "react";
import api from "../../api";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import "./LoginPage.scss";
import LoadingIndicator from "../../components/LoadingIndicator";

function LoginPage({setIsLoggedIn}){
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  async function formSubmitted(e){
    e.preventDefault()
    setIsLoading(true)
    const response = await api.post(`/users/login`, {
      email: email,
      password: password
    })
    setIsLoading(false)

    if (response.ok) {
      localStorage.setItem("access_token", response.data.access_token)
      setIsLoggedIn(true)
      history.push("/")
    } else if (response.data) {
      alert(response.data.error)
    } else {
      alert('Ocorreu um erro na comunicação com o servidor.')
    }
  }

  return(
    <Container>
      {isLoading && <LoadingIndicator/>}
      {!isLoading && (
        <div>
          <h1>Entrar</h1>
          <Form className="form"  onSubmit={formSubmitted} 
          >
            <Form.Group controlId="itemName">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Digite o email"
                value={email} 
                onChange={ e => setEmail(e.target.value) }
              />
              <Form.Label>Senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Digite a senha" 
                value={ password } 
                onChange={ e => setPassword(e.target.value) }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Entrar
            </Button><br/><br/>
            <Link to="/users/signup">Não tem uma conta? Click aqui</Link>
          </Form>
        </div>
      )}
    </Container>
  )
}

export default LoginPage;