import { useState } from 'react'
import { Card, BtnGenerate, BtnSecondary, BtnRow, LoadingState, OutputBlock, formatOutput } from '../UI.jsx'
import useGenerate from '../../hooks/useGenerate.js'

export default function Step2Validate({ ideaData, outputs, onComplete, onNext, onBack }) {
  const [output, setOutput] = useState('')
  const { generate, loading, loadingText } = useGenerate()

  async function run() {
    const system = `You are VEGA, an expert digital product market analyst. Give specific, data-informed analysis. Be direct and concrete. No generic advice. Use ## headers and bullet points.`

    const prompt = `Run a full market validation for this digital product:
${JSON.stringify(ideaData)}
Previous analysis: ${outputs.step1 || ''}

## Demand Analysis
Where is real demand coming from? What are people actively searching for, asking about, or complaining about in this niche?

## Competitor Landscape
What already exists? What are the top 3 competitor types doing well — and what are they missing that this product can fill?

## Saturation Level
Oversaturated, growing, or wide open? Honest assessment with reasoning.

## Hyper-Specific Positioning
Sharpen this idea to a hyper-niche angle. Example: "weekly planning templates for ADHD freelancers." Give the sharpened version of this specific idea.

## Proof of Demand Indicators
3-5 specific signals confirming a real paying audience exists for this.

## Green Light / Red Light
Build as described, modify it, or pivot? One clear verdict with reasoning.

Under 550 words.`

    try {
      const result = await generate({
        system, prompt,
        loadingMessages: ['Researching demand signals...', 'Scanning the competition...', 'Checking market saturation...', 'Finding your winning angle...']
      })
      setOutput(result)
      onComplete(2, result)
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <Card icon="◎" iconColor="cyan" title="Market validation" subtitle="Demand, competition, saturation, and your best angle to win.">
      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.65 }}>
        VEGA will research the real market for your idea — checking demand signals, competitor landscape, saturation level, and the specific angle that gives you the best shot at standing out.
      </p>
      <BtnRow>
        <BtnGenerate onClick={run} disabled={loading}>
          <span>◎</span> {loading ? 'Researching...' : 'Run market validation'}
        </BtnGenerate>
        <BtnSecondary onClick={() => onBack(1)}>← Back</BtnSecondary>
      </BtnRow>

      {loading && <LoadingState text={loadingText} />}

      <OutputBlock title="◎ Validation Report" contentId="step2Content" visible={!!output}>
        <div dangerouslySetInnerHTML={{ __html: formatOutput(output) }} />
        <div style={{ marginTop: 20 }}>
          <BtnGenerate onClick={() => onNext(3)}>Continue to Build →</BtnGenerate>
        </div>
      </OutputBlock>
    </Card>
  )
}
