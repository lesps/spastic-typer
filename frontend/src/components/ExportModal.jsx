import { useState, useRef } from 'react';
import { G } from '../styles/theme.js';
import { S } from '../styles/styles.js';
import { downloadJSON } from '../utils/export.js';

export default function ExportModal({ markdown, backup, onClose }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (textRef.current) {
        textRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleDownload = () => {
    const name = `ps-${backup.type}-${(backup.result || '').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    downloadJSON(backup, name);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
      <div style={{ background: G.bg2, border: `1px solid ${G.goldBorder}`, borderRadius: '16px 16px 0 0', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${G.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ ...S.h2, marginBottom: 0, fontSize: 18 }}>Export</h2>
            <button onClick={onClose} style={{ ...S.btnOutline, padding: '6px 12px', fontSize: 12 }}>Close</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ ...S.card, marginBottom: 0, padding: '12px 14px' }}>
              <h3 style={{ ...S.h3, marginBottom: 4 }}>AI Report</h3>
              <p style={{ ...S.body, fontSize: 12, marginBottom: 10 }}>Markdown context for any AI assistant.</p>
              <button
                onClick={handleCopy}
                style={{ ...S.btn, width: '100%', padding: '8px', fontSize: 13, background: copied ? '#50c878' : G.gold }}
              >
                {copied ? '✓ Copied' : 'Copy Markdown'}
              </button>
            </div>
            <div style={{ ...S.card, marginBottom: 0, padding: '12px 14px' }}>
              <h3 style={{ ...S.h3, marginBottom: 4 }}>Backup</h3>
              <p style={{ ...S.body, fontSize: 12, marginBottom: 10 }}>JSON file — import into Compare.</p>
              <button onClick={handleDownload} style={{ ...S.btnOutline, width: '100%', padding: '8px', fontSize: 13 }}>Download .json</button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <textarea
            ref={textRef}
            readOnly
            value={markdown}
            style={{ width: '100%', minHeight: 300, height: '100%', background: G.bg, color: G.textDim, fontFamily: "'DM Mono',monospace", fontSize: 11, lineHeight: 1.7, border: 'none', padding: '14px 18px', resize: 'none', outline: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
