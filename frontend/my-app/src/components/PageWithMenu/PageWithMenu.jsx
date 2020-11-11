import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageMenu from '../PageMenu';
import './PageWithMenu.scss'

function PageWithMenu({ children }){
  return (
    <Container>
      <Row className="no-gutters">
        <Col lg={{span: 2, offset:2}}>
          <PageMenu />
        </Col>
        <Col lg={6} className="pageWithMenu-content">
          {children}
        </Col>
      </Row> 
    </Container>
  )  
}

export default PageWithMenu;