import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('TutorIA root render error', error, info)
  }

  render() {
    if (!this.state.error) {
      return this.props.children
    }

    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          background: 'var(--app-bg)',
          color: 'var(--text-primary)',
          fontFamily: '"Plus Jakarta Sans", "Outfit", ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <section
          style={{
            width: 'min(720px, 100%)',
            borderRadius: '24px',
            border: '1px solid var(--line)',
            background: 'var(--surface-card)',
            padding: '24px',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-strong)' }}>
            Error de render
          </p>
          <h1 style={{ margin: '12px 0 0', fontSize: '28px', lineHeight: 1.05 }}>
            La interfaz encontro un problema al cargar
          </h1>
          <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {this.state.error?.message || 'Error desconocido'}
          </p>
          <pre
            style={{
              margin: '16px 0 0',
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--surface-strong)',
              overflow: 'auto',
              fontSize: '12px',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {String(this.state.error?.stack || '').slice(0, 2500)}
          </pre>
        </section>
      </main>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
)
