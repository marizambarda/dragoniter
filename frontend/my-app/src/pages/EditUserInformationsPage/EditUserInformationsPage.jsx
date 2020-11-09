import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import api from "../../api";
import { Container, Row, Col, Form, InputGroup, FormControl, Button, Alert } from "react-bootstrap";
import PageWithMenu from "../../components/PageWithMenu";
import LoadingIndicator from "../../components/LoadingIndicator";

function EditUserInformationsPage({loggedUser}){
  const history = useHistory();
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

    const data = {
      name: name,
      nickname: nickname,
      email: email
    }
    if(password !== ""){
      data.password = password
    }
    setIsLoading(true)
    const response = await api.put(`/me`, data)
    setIsLoading(false)
    if (response.ok) {
      setShowSuccessMessage(true)
    } else {
      alert(response.data.error)
    }
  }
  return(
   <Container>
     <PageWithMenu loggedUser={loggedUser}>
      {isLoading && <LoadingIndicator/>}
      {!isLoading && (
       <div className="pagePadding">
          <h1 className="titlePage editUserPage">Editar dados de usuário</h1>
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
      )}
    </PageWithMenu>
      
   </Container>
  )
}

export default EditUserInformationsPage;