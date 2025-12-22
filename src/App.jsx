import { useState } from 'react'
import { CompareView } from './components/CompareView'
import { ArrowLeftRight, Code2, RotateCcw, Columns, AlignJustify } from 'lucide-react'

function App() {
  const [oldCode, setOldCode] = useState('')
  const [newCode, setNewCode] = useState('')
  const [viewMode, setViewMode] = useState('unified')

  const handleClear = () => {
    setOldCode('')
    setNewCode('')
  }

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)', 
            padding: '0.5rem', 
            borderRadius: '8px', 
            display: 'flex', 
            boxShadow: '0 0 15px rgba(46, 160, 67, 0.4)'
          }}>
            <Code2 color="white" size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>DiffChecker</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Compara código rápidamente</p>
          </div>
        </div>
        
        <button className="btn btn-secondary" onClick={handleClear} disabled={!oldCode && !newCode}>
           <RotateCcw size={16} />
           Limpiar
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Código Original</label>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            placeholder="// Pega el código original aquí..."
            style={{
              width: '100%',
              height: '300px',
              padding: '1rem',
              borderRadius: '8px',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontFamily: 'inherit'
            }}
            spellCheck={false}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Código Modificado</label>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="// Pega el código nuevo aquí..."
            style={{
              width: '100%',
              height: '300px',
              padding: '1rem',
              borderRadius: '8px',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontFamily:'inherit'
            }}
            spellCheck={false}
          />
        </div>
      </div>

      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1rem',
          minHeight: '32px'
      }}>
         <div>
             {(oldCode || newCode) && (
                <div style={{ 
                   display: 'inline-flex', 
                   alignItems: 'center', 
                   gap: '0.5rem', 
                   color: 'var(--text-secondary)', 
                   fontSize: '0.875rem',
                   background: 'var(--bg-tertiary)',
                   padding: '0.25rem 0.75rem',
                   borderRadius: '999px'
                }}>
                  <ArrowLeftRight size={14} />
                  Viendo Cambios
                </div>
             )}
         </div>

         {(oldCode || newCode) && (
            <div style={{ background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '6px', display: 'flex', gap: '4px', border: '1px solid var(--border-color)' }}>
                <button 
                  onClick={() => setViewMode('unified')}
                  style={{
                      background: viewMode === 'unified' ? 'var(--bg-secondary)' : 'transparent',
                      color: viewMode === 'unified' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: viewMode === 'unified' ? 'var(--border-color)' : 'transparent',
                      borderRadius: '4px',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                  }}>
                    <AlignJustify size={14} /> Unificado
                </button>
                <button 
                  onClick={() => setViewMode('split')}
                  style={{
                      background: viewMode === 'split' ? 'var(--bg-secondary)' : 'transparent',
                      color: viewMode === 'split' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: viewMode === 'split' ? 'var(--border-color)' : 'transparent',
                      borderRadius: '4px',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                  }}>
                    <Columns size={14} /> Dividido
                </button>
            </div>
         )}
      </div>

      <CompareView oldCode={oldCode} newCode={newCode} mode={viewMode} />
      
      <footer style={{ marginTop: 'auto', padding: '2rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
        <p>Herramienta diseñada y codificada por <a href="https://vexel-code.com" target="_blank" rel="noopener noreferrer" className="footer-link">vexel-code.com</a> &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
