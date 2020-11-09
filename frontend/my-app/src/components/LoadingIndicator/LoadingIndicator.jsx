import React from 'react'
import './LoadingIndicator.scss'

function LoadingIndicator () {
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
  )
}

export default LoadingIndicator