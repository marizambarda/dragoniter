import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, InputGroup, FormControl, Button, Alert } from "react-bootstrap";
import PageWithMenu from "../../components/PageWithMenu";

function EditSignUpPage({loggedUser}){
  const history = useHistory();
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(()=>{
    if(loggedUser){
      setName(loggedUser.name)
      setEmail(loggedUser.email)
      setNickname(loggedUser.nickname)
    }
  }, [loggedUser])
  async function formSubmited(e){
    e.preventDefault()
    setShowSuccessMessage(false)
    try{
      const data = {
        name: name,
        nickname: nickname,
        email: email
      }
      if(password !== ""){
        data.password = password
      }
      await axios.put(`http://localhost:9000/me`, data, {
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
      setShowSuccessMessage(true)
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
     <PageWithMenu loggedUser={loggedUser}>
       <div className="pagePadding">
          <h2>Editar dados de usuário</h2>
          {showSuccessMessage && (
            <Alert variant={'success'}>
            Dados atualizados com sucesso!
           </Alert>
          )}
          <Form className="form" onSubmit={formSubmited}
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
        </div>
      </PageWithMenu>
   </Container>
  )
}

export default EditSignUpPage;