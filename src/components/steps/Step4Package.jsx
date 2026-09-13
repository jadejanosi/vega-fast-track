import { useState } from 'react'
import { Card, BtnGenerate, BtnSecondary, BtnRow, LoadingState, OutputBlock, formatOutput } from '../UI.jsx'
import useGenerate from '../../hooks/useGenerate.js'

export default function Step4Package({ ideaData, outputs, onComplete, onNext, onBack }) {
  const [output, setOutput] = useState('')
  const { generate, loading, loadingText } = useGenerate()

  async function run() {
    const system = `You are VEGA, a digital product packaging expert. Help creators make their products look and feel worth buying. Be specific and visual in your descriptions. Use ## headers and bullet points.`

    const prompt = `Write a complete packaging brief for this digital product:
Product details: ${outputs.step3 || ''}
Niche & audience: ${ideaData.niche} / ${ideaData.audience}

## Cover Design Brief
Specific visual direction — color palette suggestion, mood, what to feature, what to avoid. Written so a Canva designer can execute it without guessing.

## Product Mockup Style
Best mockup type for this product format and where to use it (sales page, Instagram, etc.).

## What Makes It Look Premium
5 specific things to do inside the product and in its presentation to make it look worth 2-5x the price.

## File Naming & Delivery
Exact file naming convention, delivery method, and what to include in the delivery email.

## Pre-Launch Checklist
8-10 items to check off before going live — specific to this product type.

Under 500 words.`

    try {
      const result = await generate({
        system, prompt,
        loadingMessages: ['Writing your packaging brief...', 'Designing your cover direction...', 'Building your delivery checklist...']
      })
      setOutput(result)
      onComplete(4, result)
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <Card icon="⬡" iconColor="amber" title="Package your product" subtitle="Cover brief, design direction, and delivery checklist.">
      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.65 }}>
        A product that looks premium sells at a premium. VEGA will write your cover brief, design direction, and give you a pre-launch checklist to get it ready to sell.
      </p>
      <BtnRow>
        <BtnGenerate onClick={run} disabled={loading}>
          <span>⬡</span> {loading ? 'Packaging...' : 'Package my product'}
        </BtnGenerate>
        <BtnSecondary onClick={() => onBack(3)}>← Back</BtnSecondary>
      </BtnRow>

      {loading && <LoadingState text={loadingText} />}

      <OutputBlock title="⬡ Packaging Brief" contentId="step4Content" visible={!!output}>
        <div dangerouslySetInnerHTML={{ __html: formatOutput(output) }} />
        <div style={{ marginTop: 20 }}>
          <BtnGenerate onClick={() => onNext(5)}>Continue to Launch →</BtnGenerate>
        </div>
      </OutputBlock>
    </Card>
  )
}
