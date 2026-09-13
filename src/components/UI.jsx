import { useState } from 'react'

export function Card({ icon, iconColor = 'violet', title, subtitle, children }) {
  const iconBg = {
    violet: { background: 'var(--violet-pale)', color: 'var(--violet)' },
    pink:   { background: 'var(--pink-pale)',   color: 'var(--pink)' },
    cyan:   { background: 'var(--cyan-pale)',   color: 'var(--cyan)' },
    amber:  { background: '#FFFBEB',            color: '#B45309' },
  }[iconColor]

  return (
    <div style={{
      background: 'var(--surface)', border: '1.5px solid var(--border)',
      borderRadius: 14, padding: 28, marginBottom: 20, boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, ...iconBg }}>
          {icon}
        </div>
        <div>
          <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{title}</div>
          {subtitle && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  )
}

export function InputGroup({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
        {label}{hint && <span style={{ fontWeight: 400, opacity: 0.6 }}> ({hint})</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)',
  borderRadius: 8, padding: '11px 14px', color: 'var(--text)',
  fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
}

export function Input({ ...props }) {
  return (
    <input
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = 'var(--violet)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
      {...props}
    />
  )
}

export function Textarea({ ...props }) {
  return (
    <textarea
      style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
      onFocus={e => e.target.style.borderColor = 'var(--violet)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
      {...props}
    />
  )
}

export function Select({ children, ...props }) {
  return (
    <select
      style={{ ...inputStyle, cursor: 'pointer' }}
      onFocus={e => e.target.style.borderColor = 'var(--violet)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
      {...props}
    >
      {children}
    </select>
  )
}

export function InputRow({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, '@media(max-width:600px)': { gridTemplateColumns: '1fr' } }}>{children}</div>
}

export function BtnGenerate({ children, ...props }) {
  return (
    <button
      style={{
        background: 'var(--grad)', border: 'none', borderRadius: 10,
        padding: '13px 26px', color: '#fff', fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8,
        transition: 'opacity 0.2s, transform 0.15s', opacity: props.disabled ? 0.4 : 1,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={e => { if (!props.disabled) { e.target.style.opacity = '0.88'; e.target.style.transform = 'translateY(-1px)' } }}
      onMouseLeave={e => { e.target.style.opacity = props.disabled ? '0.4' : '1'; e.target.style.transform = 'none' }}
      {...props}
    >
      {children}
    </button>
  )
}

export function BtnSecondary({ children, ...props }) {
  return (
    <button
      style={{
        background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 8,
        padding: '10px 20px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.color = 'var(--violet)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      {...props}
    >
      {children}
    </button>
  )
}

export function BtnRow({ children }) {
  return <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
}

export function LoadingState({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: '0.86rem', padding: '14px 0' }}>
      <div style={{
        width: 17, height: 17, border: '2px solid var(--border)', borderTopColor: 'var(--violet)',
        borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span>{text}</span>
    </div>
  )
}

export function OutputBlock({ title, contentId, children, visible }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    const el = document.getElementById(contentId)
    if (el) navigator.clipboard.writeText(el.innerText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  if (!visible) return null

  return (
    <div style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 10, padding: 20, marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h4 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--violet)' }}>{title}</h4>
        <button onClick={copy} style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontSize: '0.72rem', color: copied ? 'var(--cyan)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div id={contentId} style={{ fontSize: '0.88rem', lineHeight: 1.72, color: 'var(--text)' }}>
        {children}
      </div>
    </div>
  )
}

export function ScoreGrid({ demand, competition, profit }) {
  function cls(n) { return n >= 8 ? 'var(--cyan)' : n >= 5 ? '#B45309' : 'var(--pink)' }
  const items = [
    { val: demand, label: 'Demand' },
    { val: competition, label: 'Low Competition' },
    { val: profit, label: 'Profit Potential' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 16 }}>
      {items.map(({ val, label }) => (
        <div key={label} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: '1.55rem', color: cls(val) }}>{val}/10</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 700 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

// Renders markdown-ish AI output as HTML
export function formatOutput(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h4 style="font-family:Be Vietnam Pro,sans-serif;font-weight:700;color:var(--violet);margin:14px 0 6px;font-size:0.88rem">$1</h4>')
    .replace(/^## (.+)$/gm, '<h4 style="font-family:Be Vietnam Pro,sans-serif;font-weight:700;color:var(--cyan);margin:16px 0 8px;font-size:0.92rem">$1</h4>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => '<ul style="padding-left:18px;margin:8px 0">' + m + '</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}
