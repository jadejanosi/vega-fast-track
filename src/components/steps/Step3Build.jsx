import { useState } from 'react'
import { Card, BtnGenerate, BtnSecondary, BtnRow, LoadingState, OutputBlock, formatOutput } from '../UI.jsx'
import useGenerate from '../../hooks/useGenerate.js'

export default function Step3Build({ ideaData, outputs, onComplete, onNext, onBack }) {
  const [output, setOutput] = useState('')
  const { generate, loading, loadingText } = useGenerate()

  async function run() {
    const system = `You are VEGA, an expert digital product builder. Create complete, ready-to-execute product blueprints. Be specific and detailed. Use ## headers and bullet points.`

    const prompt = `Build a complete product blueprint:
Original idea: ${JSON.stringify(ideaData)}
Validation findings: ${outputs.step2 || ''}

## Product Title Options
3 title + subtitle combinations. Format: **Title: Subtitle** on separate lines. Benefit-driven and specific.

## Recommended Format & Delivery
Confirm the best format and exactly how it should be delivered to buyers.

## Complete Product Outline
Every section, chapter, or module with a 1-sentence description of what it covers. This is the full structure to build from.

## Recommended Price Point
Specific price with reasoning based on niche, format, and competition level.

## Platform Recommendation
Best platform to sell on and why, with one sentence on setup.

## Upsell Opportunity
The single most logical order bump or upsell for this product — what it is and at what price.

Under 600 words. Specific — no vague placeholders.`

    try {
      const result = await generate({
        system, prompt,
        loadingMessages: ['Structuring your product...', 'Writing your outline...', 'Naming your product...', 'Setting your price point...']
      })
      setOutput(result)
      onComplete(3, result)
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <Card icon="◈" iconColor="pink" title="Product builder" subtitle="Full product outline, title options, pricing, and platform recommendation.">
      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.65 }}>
        VEGA will generate your complete product structure — every section, chapter, or module — plus a title, subtitle, recommended price, and the best platform to sell it on.
      </p>
      <BtnRow>
        <BtnGenerate onClick={run} disabled={loading}>
          <span>◈</span> {loading ? 'Building...' : 'Build my product'}
        </BtnGenerate>
        <BtnSecondary onClick={() => onBack(2)}>← Back</BtnSecondary>
      </BtnRow>

      {loading && <LoadingState text={loadingText} />}

      <OutputBlock title="◈ Product Blueprint" contentId="step3Content" visible={!!output}>
        <div dangerouslySetInnerHTML={{ __html: formatOutput(output) }} />
        <div style={{ marginTop: 20 }}>
          <BtnGenerate onClick={() => onNext(4)}>Continue to Package →</BtnGenerate>
        </div>
      </OutputBlock>
    </Card>
  )
}
