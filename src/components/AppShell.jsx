import { useState } from 'react'
import styles from './AppShell.module.css'
import StepNav from './StepNav.jsx'
import Step1Idea from './steps/Step1Idea.jsx'
import Step2Validate from './steps/Step2Validate.jsx'
import Step3Build from './steps/Step3Build.jsx'
import Step4Package from './steps/Step4Package.jsx'
import Step5Launch from './steps/Step5Launch.jsx'

export default function AppShell() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [ideaData, setIdeaData] = useState({})
  const [outputs, setOutputs] = useState({})

  function markDone(step, output) {
    setCompletedSteps(prev => prev.includes(step) ? prev : [...prev, step])
    setOutputs(prev => ({ ...prev, ['step' + step]: output }))
  }

  function goToStep(n) {
    if (n > 1 && !completedSteps.includes(n - 1)) return
    setCurrentStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stepProps = { ideaData, outputs, onComplete: markDone, onNext: goToStep, onBack: goToStep }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span>VEGA</span>
          <small>Digital Product Builder</small>
        </div>
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
