import React from 'react'
import './ErrorBoundary.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="ErrorBoundary">
          <h2>Algo salió mal</h2>
          <p>Hubo un error al procesar tu recomendación.</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}>
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
