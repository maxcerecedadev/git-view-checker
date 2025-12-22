import React, { useMemo } from 'react';
import { diffLines } from 'diff';
import { FileDiff, Split, AlignJustify } from 'lucide-react';

export const CompareView = ({ oldCode, newCode, mode = 'unified' }) => {
  const diffResult = useMemo(() => {
    if (!oldCode && !newCode) return { unified: [], split: [] };
    
    const diff = diffLines(oldCode || '', newCode || '');
    
    // Unified Processing
    let uOldLine = 1;
    let uNewLine = 1;
    const unifiedRows = [];
    diff.forEach(part => {
      const lines = part.value.split('\n');
      if (lines[lines.length - 1] === '') lines.pop(); 
      
      lines.forEach(line => {
        if (part.added) {
          unifiedRows.push({ type: 'added', oldLine: null, newLine: uNewLine++, content: line });
        } else if (part.removed) {
          unifiedRows.push({ type: 'removed', oldLine: uOldLine++, newLine: null, content: line });
        } else {
          unifiedRows.push({ type: 'unchanged', oldLine: uOldLine++, newLine: uNewLine++, content: line });
        }
      });
    });

    // Split Processing
    let sOldLine = 1;
    let sNewLine = 1;
    const splitRows = [];
    
    for (let i = 0; i < diff.length; i++) {
        const part = diff[i];
        const lines = part.value.split('\n');
        if (lines[lines.length - 1] === '') lines.pop();

        if (part.added) {
            lines.forEach(line => {
                splitRows.push({
                    left: null,
                    right: { lineNum: sNewLine++, content: line, type: 'added' }
                });
            });
        } else if (part.removed) {
            const nextPart = diff[i + 1];
            if (nextPart && nextPart.added) {
                const nextLines = nextPart.value.split('\n');
                if (nextLines[nextLines.length - 1] === '') nextLines.pop();
                
                const count = Math.max(lines.length, nextLines.length);
                for (let j = 0; j < count; j++) {
                    const leftContent = lines[j];
                    const rightContent = nextLines[j];
                    
                    splitRows.push({
                        left: leftContent !== undefined ? { lineNum: sOldLine++, content: leftContent, type: 'removed' } : null,
                        right: rightContent !== undefined ? { lineNum: sNewLine++, content: rightContent, type: 'added' } : null
                    });
                }
                i++; 
            } else {
                lines.forEach(line => {
                    splitRows.push({
                        left: { lineNum: sOldLine++, content: line, type: 'removed' },
                        right: null
                    });
                });
            }
        } else {
            lines.forEach(line => {
                splitRows.push({
                    left: { lineNum: sOldLine++, content: line, type: 'unchanged' },
                    right: { lineNum: sNewLine++, content: line, type: 'unchanged' }
                });
            });
        }
    }

    return { unified: unifiedRows, split: splitRows };
  }, [oldCode, newCode]);

  if (!oldCode && !newCode) {
    return (
      <div className="empty-state" style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        color: 'var(--text-secondary)',
        border: '2px dashed var(--border-color)',
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <FileDiff size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>Listo para comparar</p>
        <p style={{ fontSize: '0.875rem' }}>Pega el código arriba para ver las diferencias.</p>
      </div>
    );
  }

  const counts = {
    additions: diffResult.unified.filter(r => r.type === 'added').length,
    deletions: diffResult.unified.filter(r => r.type === 'removed').length
  };

  return (
    <div className="diff-view" style={{ 
      background: 'var(--bg-secondary)', 
      borderRadius: '8px', 
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      marginTop: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-tertiary)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
             <span>Resultados</span>
        </div>
        
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--success-color)', marginRight: '8px' }}>+ {counts.additions} líneas</span>
          <span style={{ color: 'var(--danger-color)' }}>- {counts.deletions} líneas</span>
        </span>
      </div>

      <div style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', 
          fontSize: '13px',
          lineHeight: '1.5',
          tableLayout: mode === 'split' ? 'fixed' : 'auto'
        }}>
          {mode === 'unified' && (
              <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ width: '40px', padding: '4px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500, borderRight: '1px solid var(--border-color)' }}>Ant</th>
                      <th style={{ width: '40px', padding: '4px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500, borderRight: '1px solid var(--border-color)' }}>Nue</th>
                      <th style={{ width: '20px' }}></th>
                      <th style={{ textAlign: 'left', padding: '4px 8px', color: 'var(--text-secondary)', fontWeight: 500 }}>Contenido</th>
                  </tr>
              </thead>
          )}
          {mode === 'split' && (
              <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ width: '50%', padding: '0', borderRight: '1px solid var(--border-color)' }}>
                          <div style={{ padding: '4px 8px', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center' }}>Original</div>
                      </th>
                      <th style={{ width: '50%', padding: '0' }}>
                          <div style={{ padding: '4px 8px', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center' }}>Modificado</div>
                      </th>
                  </tr>
              </thead>
          )}

          <tbody>
            {mode === 'unified' ? diffResult.unified.map((row, idx) => {
              const color = row.type === 'added' ? 'var(--diff-add-text)' :
                            row.type === 'removed' ? 'var(--diff-del-text)' : 'var(--text-primary)';
              const bg = row.type === 'added' ? 'var(--diff-add-bg)' :
                         row.type === 'removed' ? 'var(--diff-del-bg)' : 'transparent';
              const marker = row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' ';

              return (
                <tr key={idx} style={{ backgroundColor: bg, color: color }}>
                   <td style={{ textAlign: 'right', opacity: 0.5, padding: '0 8px', borderRight: '1px solid var(--border-color)', userSelect: 'none' }}>
                     {row.oldLine || ''}
                   </td>
                   <td style={{ textAlign: 'right', opacity: 0.5, padding: '0 8px', borderRight: '1px solid var(--border-color)', userSelect: 'none' }}>
                     {row.newLine || ''}
                   </td>
                   <td style={{ textAlign: 'center', opacity: 0.7, userSelect: 'none' }}>{marker}</td>
                   <td style={{ padding: '0 8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{row.content}</td>
                </tr>
              );
            }) : diffResult.split.map((row, idx) => (
                <tr key={idx}>
                    <td style={{ 
                        width: '50%', 
                        verticalAlign: 'top', 
                        padding: 0, 
                        borderRight: '1px solid var(--border-color)',
                        backgroundColor: row.left?.type === 'removed' ? 'var(--diff-del-bg)' : 'transparent',
                        color: row.left?.type === 'removed' ? 'var(--diff-del-text)' : 'var(--text-primary)'
                    }}>
                        {row.left && (
                            <div style={{ display: 'flex' }}>
                                <div style={{ 
                                    width: '40px', 
                                    minWidth: '40px',
                                    textAlign: 'right', 
                                    padding: '0 8px', 
                                    opacity: 0.5, 
                                    userSelect: 'none',
                                    borderRight: '1px solid var(--border-color)',
                                    marginRight: '8px'
                                }}>
                                    {row.left.lineNum}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingRight: '8px' }}>
                                    {row.left.content}
                                </div>
                            </div>
                        )}
                    </td>

                    <td style={{ 
                        width: '50%', 
                        verticalAlign: 'top', 
                        padding: 0,
                        backgroundColor: row.right?.type === 'added' ? 'var(--diff-add-bg)' : 'transparent',
                        color: row.right?.type === 'added' ? 'var(--diff-add-text)' : 'var(--text-primary)'
                    }}>
                        {row.right && (
                            <div style={{ display: 'flex' }}>
                                <div style={{ 
                                    width: '40px', 
                                    minWidth: '40px',
                                    textAlign: 'right', 
                                    padding: '0 8px', 
                                    opacity: 0.5, 
                                    userSelect: 'none',
                                    borderRight: '1px solid var(--border-color)',
                                    marginRight: '8px'
                                }}>
                                    {row.right.lineNum}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingRight: '8px' }}>
                                    {row.right.content}
                                </div>
                            </div>
                        )}
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
