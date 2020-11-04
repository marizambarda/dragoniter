import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image } from "react-bootstrap";
import "./PageMenu.scss";


function PageMenu({loggedUser}){
  let menu

  if (loggedUser) {
    menu = <LoggedInMenu loggedUser={loggedUser} />
  } else {
    menu = <LoggedOutMenu loggedUser={loggedUser} />
  }

  return(
    <div className="menuSection">
      <div className="menu">
        {menu}
      </div>
    </div>
  )
}

function LoggedInMenu ({ loggedUser }) {
  async function logout(e){
    e.preventDefault()
    if (window.confirm('Deseja sair?')) {
      localStorage.removeItem("access_token")
      window.location.reload()
    }
  }

  return (
    <>
      <Image className="perfilImage" src={loggedUser.avatar_url} roundedCircle />
      <Row>
        <Col><Link to={"/"}>Página Inicial</Link></Col>
      </Row>
      <Row>
        <Col><Link to={`/${loggedUser.nickname}`}>Perfil</Link></Col>
      </Row>
      <Row>
        <Col><a href={`#`} onClick={logout}>Sair</a></Col>
      </Row>
    </>
  )
}

function LoggedOutMenu ({ loggedUser }) {
  return (
    <>
      <Row>
        <Col><Link to="/users/login">Login</Link></Col>
      </Row>
      <Row>
        <Col><Link to="/users/signup">Cadastrar</Link></Col>
      </Row>
    </>
  )
}

export default PageMenu;