import { useState } from 'react'
import styles from './AppShell.module.css'
import StepNav from './StepNav.jsx'
import Step1Idea from './steps/Step1Idea.jsx'
import Step2Validate from './steps/Step2Validate.jsx'
import Step3Build from './steps/Step3Build.jsx'
import Step4Package from './steps/Step4Package.jsx'
import Step5Launch from './steps/Step5Launch.jsx'

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').trim()
}

function downloadAll(ideaData, outputs) {
  const sections = [
    { title: 'VEGA DIGITAL PRODUCT BUILDER — FAST TRACK SESSION EXPORT', content: `Generated: ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}\nNiche: ${ideaData.niche || '—'}\nAudience: ${ideaData.audience || '—'}\nIdea: ${ideaData.idea || '—'}` },
    outputs.step1 && { title: 'STEP 1 — IDEA ANALYSIS', content: stripHtml(outputs.step1) },
    outputs.step2 && { title: 'STEP 2 — MARKET VALIDATION', content: stripHtml(outputs.step2) },
    outputs.step3 && { title: 'STEP 3 — PRODUCT BLUEPRINT', content: stripHtml(outputs.step3) },
    outputs.step4 && { title: 'STEP 4 — PACKAGING BRIEF', content: stripHtml(outputs.step4) },
    outputs.step5 && { title: 'STEP 5 — LAUNCH PLAN', content: stripHtml(outputs.step5) },
  ].filter(Boolean)

  const text = sections.map(s => `${'='.repeat(60)}\n${s.title}\n${'='.repeat(60)}\n\n${s.content}`).join('\n\n\n')

  const blob = new Blob([text], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `vega-fasttrack-${(ideaData.niche || 'product').toLowerCase().replace(/\s+/g,'-')}-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AppShell() {
  const [currentStep,    setCurrentStep]    = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [ideaData,       setIdeaData]       = useState({})
  const [outputs,        setOutputs]        = useState({})

  function markDone(step, output) {
    setCompletedSteps(prev => prev.includes(step) ? prev : [...prev, step])
    setOutputs(prev => ({ ...prev, ['step' + step]: output }))
  }

  function goToStep(n) {
    if (n > 1 && !completedSteps.includes(n - 1)) return
    setCurrentStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasAnyOutput = Object.keys(outputs).length > 0
  const stepProps = { ideaData, outputs, onComplete: markDone, onNext: goToStep, onBack: goToStep }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span>VEGA</span>
          <small>Digital Product Builder</small>
        </div>
        {hasAnyOutput && (
          <button
            onClick={() => downloadAll(ideaData, outputs)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--violet-pale)', border: '1.5px solid var(--violet)',
              borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
              fontSize: '0.78rem', color: 'var(--violet)', transition: 'opacity .15s'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '.8'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            ↓ Save my session
          </button>
        )}
      </header>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1>Let's build something that sells.</h1>
          <p>Work through each step below. Your idea goes in, a validated, packaged, ready-to-sell digital product comes out.</p>
        </div>

        <StepNav current={currentStep} completed={completedSteps} onGo={goToStep} />

        {currentStep === 1 && <Step1Idea {...stepProps} onIdeaSave={setIdeaData} />}
        {currentStep === 2 && <Step2Validate {...stepProps} />}
        {currentStep === 3 && <Step3Build {...stepProps} />}
        {currentStep === 4 && <Step4Package {...stepProps} />}
        {currentStep === 5 && <Step5Launch {...stepProps} isFastTrack={true} />}
      </main>

      <footer className={styles.footer}>
        VEGA Digital Product Builder &nbsp;·&nbsp;
        <a href="https://jadejanosi.com" target="_blank" rel="noreferrer">jadejanosi.com</a>
      </footer>
    </div>
  )
}
