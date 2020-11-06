import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Container, Row, Col, Form, InputGroup, FormControl, Button } from "react-bootstrap";
//import './EditSignUpPage.scss'

function EditSignUpPage({loggedUser, setIsLoggedIn}){
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(()=>{
    if(loggedUser){
      setName(loggedUser.name)
      setEmail(loggedUser.email)
      setNickname(loggedUser.nickname)
    }
  }, [loggedUser])
  async function FormSubmited(e){
    e.preventDefault()
    try{
      const data = {
        name: name,
        nickname: nickname,
        email: email
      }
      if(password !== ""){
        data.password = password
      }
      const response = await axios.put(`http://localhost:9000/me`, data, {
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
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
     <h1>Editar dados de usuário</h1>
      <Form className="form" onSubmit={FormSubmited}
      >
        <Form.Group controlId="itemName">
        <Row> 
          <Col>
            <Form.Label>Nome</Form.Label>
            <Form.Control 
              type="name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
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
               value={nickname}
               onChange={(e)=>setNickname(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
       
        <Row>
          <Col>
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          </Col>
          <Col> 
          <Form.Label>Senha</Form.Label>
          <Form.Control 
            type="password"
            value={password} 
            onChange={(e)=>setPassword(e.target.value)}
            autoComplete={false}
          />
          </Col>
        </Row>
          
        </Form.Group>
        <Button variant="primary" type="submit">
          Atualizar
        </Button><br/><br/>
      </Form>
   </Container>
  )
}

export default EditSignUpPage;