import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import './Search.scss';

function Search() {
  const history = useHistory();
  const [term, setTerm] = useState('');

  useEffect(() => {
    const params = qs.parse(window.location.search.replace('?', ''));
    setTerm(params.term);
  }, [window.location.search]);

  async function formSubmitted(e) {
    e.preventDefault();
    history.push(`/search?term=${term}`);
    window.location.reload();
  }

  return (
    <div className="searchComponent">
      <Form onSubmit={formSubmitted}>
        <Form.Row className="align-items-center">
          <Col lg={{ offset: 6 }}>
            <Form.Control
              className="mb-2"
              id="inlineFormInput"
              placeholder="Pesquisa"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </Col>
          <Col lg={1}>
            <Button type="submit" className="mb-2">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}
export default Search;
