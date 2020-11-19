import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import './Search.scss';

function Search({ onSubmit }) {
  const history = useHistory();
  const [term, setTerm] = useState('');

  useEffect(() => {
    const params = qs.parse(window.location.search.replace('?', ''));
    setTerm(params.term);
  }, [window.location.search]);

  async function formSubmitted(e) {
    e.preventDefault();
    onSubmit(term);
    //window.location.reload();
  }

  return (
    <div className="searchComponent">
      <Form onSubmit={formSubmitted}>
        <Form.Row className="align-items-center">
          <Col lg={{ offset: 6 }}>
            <div style={{ display: 'flex' }}>
              <Form.Control
                className="mb-2"
                id="inlineFormInput"
                placeholder="Pesquisa"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <Button
                style={{ marginLeft: '10px' }}
                type="submit"
                className="mb-2"
              >
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </div>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}
export default Search;
