import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image } from "react-bootstrap";
import { useAppContext} from "../../AppContext";
import "./PageMenu.scss";


function PageMenu(){
  const {loggedUser} = useAppContext()
  let menu

  if (loggedUser) {
    menu = <LoggedInMenu/>
  } else {
    menu = <LoggedOutMenu/>
  }

  return( 
    <div>
      <DesktopMenu menu={menu}/>
      <MobileMenu menu={menu}/>
    </div>
  )
}

function DesktopMenu({menu}){
  return(
    <div className="desktopMenu">
      <div className="menu">
        {menu}
      </div>
    </div>
  )
}

function MobileMenu({menu}){
  const [menuOpen, setMenuOpen] = useState(false)

  async function toggleMenu(e){
    e.preventDefault()
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="mobileMenuHeader ">
      <h1>Twitter</h1>
      <a 
        href="#" 
        onClick={toggleMenu} 
        className={menuOpen ? 'mobileMenuIcon open' : 'mobileMenuIcon'}
      >
        <div>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </a>
    
      {menuOpen && (
        <div className="mobileMenu">
          {menu}
        </div>
      )}
    </div>
  )

}

function LoggedInMenu () {
  const {loggedUser} = useAppContext()

  async function logout(e){
    e.preventDefault()
    if (window.confirm('Deseja sair?')) {
      localStorage.removeItem("access_token")
      window.location.reload()
    }
  }

  return (
    <>
      <Link to={`/${loggedUser.nickname}`}><Image className="perfilImage" src={loggedUser.avatar_url} roundedCircle /></Link>
      <Row>
        <Col><Link to={"/"}>Página Inicial</Link></Col>
      </Row>
      <Row>
        <Col><Link to={`/mentions`}>Menções</Link></Col>
      </Row>
      <Row>
        <Col><Link to={`/${loggedUser.nickname}`}>Perfil</Link></Col>
      </Row>
      <Row>
        <Col><Link to={`/editprofile`}>Editar Informações</Link></Col>
      </Row>
      <Row>
        <Col><a href={`#`} onClick={logout}>Sair</a></Col>
      </Row>
    </>
  )
}

function LoggedOutMenu () {
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