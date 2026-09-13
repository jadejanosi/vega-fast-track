import styles from './StepNav.module.css'

const STEPS = ['Idea', 'Validate', 'Build', 'Package', 'Launch']

export default function StepNav({ current, completed, onGo }) {
  return (
    <nav className={styles.nav}>
      {STEPS.map((label, i) => {
        const n = i + 1
        const isDone = completed.includes(n)
        const isActive = current === n
        const isLocked = !isDone && !isActive && !completed.includes(n - 1) && n !== 1

        return (
          <button
            key={n}
            className={`${styles.step} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''} ${isLocked ? styles.locked : ''}`}
            onClick={() => onGo(n)}
            disabled={isLocked}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className={styles.num}>0{n}</span>
            {label}{isDone ? ' ✓' : ''}
          </button>
        )
      })}
    </nav>
  )
}
