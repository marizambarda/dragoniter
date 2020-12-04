'use strict';

import React from 'react';
import { Container } from 'react-bootstrap';
import './Disclaimer.scss';

function Disclaimer() {
  return (
    <div className="disclaimer-component">
      <div className="disclaimer-component__content">
        <Container>
          Este site foi desenvolvido apenas para fins de aprendizado, e não
          possui nenhuma relação com o Twitter real.
          <br />
          Desenvolvido por{' '}
          <a href="https://marianazambarda.com" target="_blank">
            Mariana Zambarda
          </a>{' '}
          - Código-fonte no{' '}
          <a
            href="https://www.github.com/marizambarda/twitterClone"
            target="_blank"
          >
            GitHub
          </a>
        </Container>
      </div>
    </div>
  );
}

export default Disclaimer;
