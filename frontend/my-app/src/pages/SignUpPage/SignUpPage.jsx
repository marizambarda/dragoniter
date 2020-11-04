import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import "./SignUpPage.scss";

function SignUpPage({setIsLoggedIn}){
  const history = useHistory();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  async function formSubmitted(e){
    e.preventDefault()
    try{
      const response = await axios.post(`http://localhost:9000/users`, {
        name: name,
        nickname: nickname,
        email: email,
        password: password
      })

      localStorage.setItem("access_token", response.data.access_token)
      setIsLoggedIn(true)
      history.push("/")
    } catch (error){
      if (error.response) {
        alert(error.response.data.error)
      } else {
        throw error
      }
    }

  }
  return(
    <Container>
      <h1>Cadastrar-se</h1>
      <Form className="form" onSubmit={formSubmitted}
      >
        <Form.Group controlId="itemName">
        <Row> 
          <Col>
            <Form.Label>Nome</Form.Label>
            <Form.Control 
              type="name" 
              placeholder="Digite o nome"
              value={name}
              onChange={ e => setName(e.target.value) }
            />
          </Col>
          <Col>
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
          </Col>
        </Row>
       
        <Row>
          <Col>
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Digite o email"
            value={email}
            onChange={ e => setEmail(e.target.value) }
          />
          </Col>
          <Col> 
          <Form.Label>Senha</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Digite a senha"  
            value={password}
            onChange={ e => setPassword(e.target.value) }
          />
          </Col>
        </Row>
          
        </Form.Group>
        <Button variant="primary" type="submit">
          Entrar
        </Button><br/><br/>
        <Link to="/users/login">Já tem uma conta? Click aqui</Link>
      </Form>
    </Container>
  )
}


export default SignUpPage;