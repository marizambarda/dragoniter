import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingIndicator.scss';

function LoadingIndicator({ small }) {
  if (small) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );
  } else {
    return (
      <div className="loadingIndicator">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}

export default LoadingIndicator;
