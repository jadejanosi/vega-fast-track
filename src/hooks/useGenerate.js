import { useState, useRef } from 'react'

export default function useGenerate() {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const timerRef = useRef(null)

  function startCycle(messages) {
    let i = 0
    setLoadingText(messages[0])
    timerRef.current = setInterval(() => {
      i = (i + 1) % messages.length
      setLoadingText(messages[i])
    }, 2200)
  }

  function stopCycle() {
    clearInterval(timerRef.current)
  }

  async function generate({ system, prompt, loadingMessages }) {
    setLoading(true)
    startCycle(loadingMessages)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'API error')
      stopCycle()
      setLoading(false)
      return data.result
    } catch (err) {
      stopCycle()
      setLoading(false)
      throw err
    }
  }

  return { generate, loading, loadingText }
}
