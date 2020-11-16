import React, { useContext, useState } from "react";
import { createContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useAppContext} from "../../AppContext";
const ForgotPasswordContext = createContext()

function ForgotPasswordPage(){
  const [step, setStep] = useState("provideEmail")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")

  return(
    <ForgotPasswordContext.Provider
      value={{step, setStep, email, setEmail, code, setCode}}
    >

      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3 }}>
            <h1>Redefinir senha</h1>
            {step === "provideEmail" && <ProvadeEmailForm/>}
            {step === "enterCode" && <EnterCodeForm/>}
            {step === "defineNewPassword" && <DefineNewPassword/>}
          </Col>
        </Row>
      </Container>

    </ForgotPasswordContext.Provider>
  )
}

function ProvadeEmailForm({buttonText}){
  const { email, setEmail, setStep } = useContext(ForgotPasswordContext)
  const [isLoading, setIsLoading] = useState(false)

  async function formSubmitted(e){
    e.preventDefault()
    setIsLoading(true)
    const response = await api.post('/forgot_password/request_code', { email: email })
    if (response.ok) {
    setStep("enterCode")
    } else{
      alert("Email não encontrado!")
    }
    setIsLoading(false)
  }

  return(
    <Form onSubmit={formSubmitted}>
      <Form.Group>
        <Form.Label>Digite o email</Form.Label>
        <Form.Control 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit" 
        disabled={isLoading}

      >
        {isLoading && <LoadingIndicator  small />}
        {isLoading ? 'Enviando' : 'Enviar' }
      </Button>
    </Form>
  )
}

function EnterCodeForm({buttonText}){
  const { email, code, setCode, setStep} = useContext(ForgotPasswordContext)
  const [isLoading, setIsLoading] = useState(false)
  
  async function formSubmitted(e){
    e.preventDefault()
    setIsLoading(true)
    const response = await api.post('/forgot_password/verify_code',
      { forgot_password_code: code, email: email }
    )
    if(response.ok){
      setStep("defineNewPassword")
    } else{
      alert("Código errado!")
    }
    setIsLoading(false)
  }
  return(
    <Form onSubmit={formSubmitted}>
      <Form.Group>
        <Form.Label>Enviamos um código para o seu email. Digite o código para redefinir a senha</Form.Label>
        <Form.Control 
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit" 
        disabled={isLoading}
        
      >
        {isLoading && <LoadingIndicator  small />}
        {isLoading ? 'Enviando' : 'Enviar' }
      </Button>
    </Form>
  )
}

function DefineNewPassword({buttonText}){
  const history = useHistory();
  const {setIsLoggedIn} = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const { email, code} = useContext(ForgotPasswordContext)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordConfirmationMismatch, setPasswordConfirmationMismatch] = useState(false)

  async function formSubmitted(e){
    e.preventDefault()
    if(password !== confirmPassword){
      setPasswordConfirmationMismatch(true)
      return
    }

    setIsLoading(true)
    const response = await api.post('/forgot_password/reset_password',
    { forgot_password_code: code, email: email, password: password }
    )
    if(response.ok){
      localStorage.setItem("access_token", response.data.access_token)
      setIsLoggedIn(true)
      history.push("/")
    } else if (response.data) {
      alert(response.data.error)
    } else {
      alert('Ocorreu um erro na comunicação com o servidor.')
    }
    setIsLoading(false)
  }

  return(
    <Form onSubmit={formSubmitted}>
      <Form.Group>
        <Form.Label>Digite a nova senha</Form.Label>
        <Form.Control 
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            setPasswordConfirmationMismatch(false)
          }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Confime a nova senha</Form.Label>
        <Form.Control 
          type="password"
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
        defaultText={"Enviar"}
      >
        {isLoading && <LoadingIndicator  small />}
        {isLoading ? 'Enviando' : 'Enviar' }
      </Button>
    </Form>
  )
}


export default ForgotPasswordPage;