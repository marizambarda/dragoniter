import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageMenu from '../PageMenu';
import './PageWithMenu.scss'

function PageWithMenu({ children, loggedUser }){
  return (
    <Container>
      <Row className="no-gutters">
        <Col md={{span: 2, offset:2}}>
          <PageMenu loggedUser={loggedUser} />
        </Col>
        <Col md={6} className="pageWithMenu-content">
          {children}
        </Col>
      </Row> 
    </Container>
  )  
}

export default PageWithMenu;