import { useState } from 'react'
import styles from './AuthScreen.module.css'

export default function AuthScreen({ onLogin }) {
  const [screen, setScreen] = useState('login') // login | signup | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Simple client-side session store using localStorage
  // In production this is your Systeme.io member area — this handles
  // buyers who arrive via the direct tool URL
  const getUsers = () => JSON.parse(localStorage.getItem('vega_users') || '{}')
  const saveUser = (u) => {
    const users = getUsers()
    users[u.email] = u
    localStorage.setItem('vega_users', JSON.stringify(users))
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)

    const users = getUsers()
    const user = users[email.toLowerCase()]
    if (!user || user.password !== password) {
      setError('Incorrect email or password.')
      setLoading(false)
      return
    }
    onLogin({ email: user.email, name: user.name, fastTrack: user.fastTrack })
    setLoading(false)
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!name || !email || !password || !orderNumber) { setError('Please fill in all fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)

    try {
      const res = await fetch('/api/validate-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      })
      const data = await res.json()

      if (!res.ok || !data.valid) {
        setError(data.error || 'We couldn\'t find that order. Check your order number and email match your purchase.')
        setLoading(false)
        return
      }

      const newUser = {
        email: email.toLowerCase(),
        password,
        name: name.split(' ')[0],
        fastTrack: data.fastTrack,
      }
      saveUser(newUser)
      setSuccess('Account created! Signing you in...')
      setTimeout(() => onLogin(newUser), 1000)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  function handleReset(e) {
    e.preventDefault()
    // In production: trigger Brevo transactional reset email
    setSuccess('If that email is registered, you\'ll get a reset link shortly.')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.logo}><span>VEGA</span></div>
      <p className={styles.tagline}>Digital Product Builder — validate, build, and launch</p>

      <div className={styles.card}>
        {screen === 'login' && (
          <>
            <h2>Sign in to your account</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleLogin}>
              <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" />
              <button className={styles.btnPrimary} disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
            </form>
            <p className={styles.switch}>Don't have an account? <a onClick={() => { setScreen('signup'); setError('') }}>Create one</a></p>
            <p className={styles.switch}><a onClick={() => { setScreen('reset'); setError('') }}>Forgot password?</a></p>
          </>
        )}

        {screen === 'signup' && (
          <>
            <h2>Create your account</h2>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}
            <form onSubmit={handleSignup}>
              <Field label="Your name" type="text" value={name} onChange={setName} placeholder="First name" autoComplete="given-name" />
              <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" autoComplete="new-password" />
              <Field label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
              <Field label="Order number" type="text" value={orderNumber} onChange={setOrderNumber} placeholder="e.g. 4821" hint="From your purchase confirmation email" />
              <button className={styles.btnPrimary} disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
            </form>
            <p className={styles.switch}>Already have an account? <a onClick={() => { setScreen('login'); setError('') }}>Sign in</a></p>
          </>
        )}

        {screen === 'reset' && (
          <>
            <h2>Reset your password</h2>
            {success && <div className={styles.success}>{success}</div>}
            <form onSubmit={handleReset}>
              <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
              <button className={styles.btnPrimary}>Send reset link</button>
            </form>
            <p className={styles.switch}><a onClick={() => setScreen('login')}>Back to sign in</a></p>
          </>
        )}
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder, autoComplete, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
        {label}{hint && <span style={{ fontWeight: 400, opacity: 0.6 }}> ({hint})</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)',
          borderRadius: 8, padding: '11px 14px', color: 'var(--text)',
          fontSize: '0.92rem', outline: 'none', transition: 'border-color 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = 'var(--violet)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}
