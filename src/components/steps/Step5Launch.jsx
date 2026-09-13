import { useState } from 'react'
import { Card, BtnGenerate, BtnSecondary, BtnRow, LoadingState, OutputBlock, formatOutput } from '../UI.jsx'
import useGenerate from '../../hooks/useGenerate.js'

const FAST_TRACK_TABS = [
  { id: 'content',   label: 'Product content' },
  { id: 'salespage', label: 'Sales page copy' },
  { id: 'ads',       label: 'Ad strategy' },
  { id: 'organic',   label: 'Organic launch' },
  { id: 'email',     label: 'Email sequence' },
]

export default function Step5Launch({ ideaData, outputs, isFastTrack, onComplete, onBack }) {
  const [output, setOutput] = useState('')
  const [activeTab, setActiveTab] = useState('content')
  const [tabOutputs, setTabOutputs] = useState({})
  const { generate, loading, loadingText } = useGenerate()

  async function runLaunch() {
    const system = `You are VEGA, an expert digital product launch strategist. Give specific, actionable launch plans. Use ## headers and bullet points.`

    const prompt = `Create a complete launch plan for this digital product:
Full context — Idea: ${JSON.stringify(ideaData)} | Blueprint: ${outputs.step3 || ''} | Packaging: ${outputs.step4 || ''}

## Funnel Structure
Exact funnel: entry product → order bump → upsell(s). Include price points and one-line description of each offer.

## Sales Page Must-Haves
7 elements this sales page needs to convert cold traffic. Specific to this product and audience.

## Order Bump Copy Hook
Write the actual checkbox copy. Format: "Yes — [hook]"

## Platform Setup Steps
Step-by-step how to get this live on the recommended platform. Be specific.

## First 24 Hours After Launch
5 immediate actions that drive the first sales.

## Pricing Test Recommendation
Launch at the recommended price or test differently first? One clear recommendation with reasoning.

Under 550 words.`

    try {
      const result = await generate({
        system, prompt,
        loadingMessages: ['Mapping your launch plan...', 'Building your funnel structure...', 'Writing your platform setup steps...']
      })
      setOutput(result)
      onComplete(5, result)
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <Card icon="⟡" iconColor="violet" title="Launch plan" subtitle="Funnel structure, order bump copy, platform setup, and first 24 hours.">
      <BtnRow>
        <BtnGenerate onClick={runLaunch} disabled={loading}>
          <span>⟡</span> {loading ? 'Planning...' : 'Generate my launch plan'}
        </BtnGenerate>
        <BtnSecondary onClick={() => onBack(4)}>← Back</BtnSecondary>
      </BtnRow>

      {loading && <LoadingState text={loadingText} />}

      <OutputBlock title="⟡ Launch Plan" contentId="step5Content" visible={!!output}>
        <div dangerouslySetInnerHTML={{ __html: formatOutput(output) }} />

        {/* FAST TRACK */}
        {isFastTrack && output && (
          <div style={{ marginTop: 24 }}>
            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'var(--pink-pale)', color: 'var(--pink)', border: '1px solid #FBCFE8', marginBottom: 14 }}>
              ⚡ FAST TRACK
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.65 }}>
              Your full execution suite — product content, sales page copy, ad strategy, organic launch plan, and email sequence.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {FAST_TRACK_TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  background: activeTab === t.id ? 'var(--violet-pale)' : 'var(--bg)',
                  border: `1.5px solid ${activeTab === t.id ? 'var(--violet)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '7px 14px', fontSize: '0.78rem', fontWeight: 700,
                  color: activeTab === t.id ? 'var(--violet)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
                }}>{t.label}</button>
              ))}
            </div>
            <FastTrackTab id={activeTab} ideaData={ideaData} outputs={outputs} tabOutputs={tabOutputs} setTabOutputs={setTabOutputs} />
          </div>
        )}

        {/* STANDARD GATE */}
        {!isFastTrack && output && (
          <div style={{ background: 'linear-gradient(135deg,#FFF0F7,#FCE7F3)', border: '1.5px solid #FBCFE8', borderRadius: 12, padding: 24, textAlign: 'center', marginTop: 20 }}>
            <h3 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'var(--pink)', marginBottom: 8 }}>⚡ Unlock the Fast Track suite</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 16 }}>
              Fast Track writes your actual product content, full sales page copy, ad strategy, 7-day organic content arc, and 5-email post-purchase sequence — all in this same session.
            </p>
            <button onClick={() => window.open('https://jadejanosi.com/vega-fast-track', '_blank')} style={{ background: 'linear-gradient(90deg,#E2562D,#DB2877)', border: 'none', borderRadius: 8, padding: '12px 26px', color: '#fff', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              Upgrade to Fast Track — $17
            </button>
          </div>
        )}
      </OutputBlock>
    </Card>
  )
}

function FastTrackTab({ id, ideaData, outputs, tabOutputs, setTabOutputs }) {
  const { generate, loading, loadingText } = useGenerate()

  const configs = {
    content: {
      icon: '◈', label: 'Product Content',
      desc: 'VEGA writes the actual content of your product — every section, ready to drop into Canva, Notion, or Google Docs.',
      btnLabel: 'Write my product content',
      msgs: ['Writing your product...', 'Drafting every section...', 'Making it genuinely useful...'],
      system: 'You are VEGA, a digital product content writer. Write complete, high-quality content that buyers find immediately useful. Be specific, practical, and thorough.',
      prompt: () => `Write the complete content for this digital product.
Blueprint: ${outputs.step3}
Niche & audience: ${ideaData.niche} / ${ideaData.audience}
Validation: ${outputs.step2}

Write every section in full — actual content the buyer receives, not a summary. Each section should be substantial and practical. Use clear headings. Write as an expert speaking directly to the target audience. 700-900 words of real product content.`
    },
    salespage: {
      icon: '⟡', label: 'Sales Page Copy',
      desc: 'Full sales page copy — headline, hook, bullet benefits, objection handling, guarantee, and CTA. Paste directly into your page builder.',
      btnLabel: 'Write my sales page',
      msgs: ['Writing your sales page...', 'Crafting your headline...', 'Handling objections...'],
      system: 'You are VEGA, an expert direct-response copywriter for digital products. Write punchy, conversion-focused copy that speaks directly to the buyer. No hype. No corporate language.',
      prompt: () => `Write a complete sales page for this product.
Product: ${outputs.step3}
Audience: ${ideaData.audience}
Niche: ${ideaData.niche}

In this exact order:
## Headline
## Subheadline
## Hook / Opening (2-3 sentences on the pain point — make them feel seen)
## What You Get (bullet benefits, not features)
## Who This Is For (3-4 bullets)
## What This Will Do For You (3 specific outcomes)
## Objection Handling (top 3 objections before buying this type of product)
## Guarantee
## Call to Action (button copy + closing line)

Direct, warm, benefit-driven.`
    },
    ads: {
      icon: '✦', label: 'Ad Strategy',
      desc: 'Three ad hook angles, audience targeting brief, creative direction, and a suggested daily budget split for cold vs. warm traffic.',
      btnLabel: 'Build my ad strategy',
      msgs: ['Building your ad strategy...', 'Writing hook angles...', 'Mapping your audiences...'],
      system: 'You are VEGA, a paid traffic strategist specializing in Meta ads for digital products. Give specific, executable strategies.',
      prompt: () => `Build a complete Meta ads strategy.
Product: ${outputs.step3}
Audience: ${ideaData.audience}
Niche: ${ideaData.niche}

## Hook Angle 1 — Pain Point
Full ad hook (first 3 lines of copy that stop the scroll) + creative direction.

## Hook Angle 2 — Transformation
Full ad hook + creative direction.

## Hook Angle 3 — Proof/Result
Full ad hook + creative direction.

## Audience Targeting Brief
Specific interests, behaviors, and demographics for cold Meta audiences.

## Budget Recommendation
Daily budget split: cold testing vs. warm retargeting. When to scale and what metric to watch.

## Funnel Flow
Ad → landing page → purchase → what happens next. One sentence per step.`
    },
    organic: {
      icon: '◎', label: '7-Day Organic Launch',
      desc: 'A 7-day organic content arc — post types, hook angles, and caption direction for Instagram, TikTok, or Pinterest.',
      btnLabel: 'Create my launch content plan',
      msgs: ['Planning your content arc...', 'Writing your hook angles...', 'Mapping the 7 days...'],
      system: 'You are VEGA, an organic content strategist for digital product creators. Create specific, platform-native content plans that drive sales without paid ads.',
      prompt: () => `Create a 7-day organic launch content plan.
Product: ${outputs.step3}
Audience: ${ideaData.audience}
Niche: ${ideaData.niche}

For each day include: post type, hook (first line or opening frame), content angle, CTA.

Day 1: Awareness — introduce the problem
Day 2: Credibility — why you're the right person to help
Day 3: Education — teach something directly related to the product
Day 4: Social proof / transformation
Day 5: Product reveal — soft launch announcement
Day 6: Objection handling — address the #1 reason they won't buy
Day 7: Urgency / direct sell — the close

Also include: one Pinterest strategy note and one email list CTA to use throughout the week.`
    },
    email: {
      icon: '⬡', label: 'Email Sequence',
      desc: 'A 5-email post-purchase sequence — written and ready to load into your email platform.',
      btnLabel: 'Write my email sequence',
      msgs: ['Writing your email sequence...', 'Crafting your welcome email...', 'Setting up your upsell...'],
      system: 'You are VEGA, an email marketing strategist for digital product creators. Write complete, ready-to-send sequences that build trust and drive upsells. Punchy, warm, direct.',
      prompt: () => `Write a 5-email post-purchase sequence.
Product: ${outputs.step3}
Audience: ${ideaData.audience}
Niche: ${ideaData.niche}

Write each email in full — subject line, preview text, and body copy.

Email 1 (Immediate — Delivery): Welcome + product access + what to do first
Email 2 (Day 1): The quick win — help them get their first result
Email 3 (Day 3): Social proof + community — build connection and trust
Email 4 (Day 5): Soft upsell — the next logical product they need
Email 5 (Day 7): Direct ask — clear upsell offer with urgency

Base upsell on the most logical next step for this buyer.`
    }
  }

  const c = configs[id]
  const tabOutput = tabOutputs[id] || ''

  async function run() {
    try {
      const result = await generate({ system: c.system, prompt: c.prompt(), loadingMessages: c.msgs })
      setTabOutputs(prev => ({ ...prev, [id]: result }))
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.65 }}>{c.desc}</p>
      <BtnRow>
        <BtnGenerate onClick={run} disabled={loading}>
          <span>{c.icon}</span> {loading ? 'Generating...' : c.btnLabel}
        </BtnGenerate>
      </BtnRow>
      {loading && <LoadingState text={loadingText} />}
      <OutputBlock title={`${c.icon} ${c.label}`} contentId={`ft-${id}`} visible={!!tabOutput}>
        <div dangerouslySetInnerHTML={{ __html: formatOutput(tabOutput) }} />
      </OutputBlock>
    </div>
  )
}
