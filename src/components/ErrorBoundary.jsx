import { Component } from 'react'
import { Button } from './ui/button'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-danger-bg flex items-center justify-center mx-auto">
              <svg className="h-8 w-8 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-text-primary">Algo deu errado</h2>
            <p className="text-sm text-text-muted">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            {this.state.error && (
              <details className="text-left text-xs text-text-muted bg-gray-100 rounded-xl p-4 max-h-32 overflow-auto">
                <summary className="cursor-pointer font-medium mb-1">Detalhes do erro</summary>
                {this.state.error.message}
              </details>
            )}
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
