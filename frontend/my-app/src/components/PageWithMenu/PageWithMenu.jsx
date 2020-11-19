import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageMenu from '../PageMenu';
import './PageWithMenu.scss';

function PageWithMenu({ children }) {
  return (
    <Container>
      <Row className="no-gutters">
        <Col xl={{ span: 2, offset: 1 }} lg={{ span: 2, offset: 1 }}>
          <PageMenu />
        </Col>
        <Col xl={7} lg={8} className="pageWithMenu-content">
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default PageWithMenu;
