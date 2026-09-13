import { useState } from 'react'
import { Card, InputGroup, Input, Textarea, Select, BtnGenerate, BtnRow, LoadingState, OutputBlock, ScoreGrid, formatOutput } from '../UI.jsx'
import useGenerate from '../../hooks/useGenerate.js'

export default function Step1Idea({ onIdeaSave, onComplete, onNext }) {
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [idea, setIdea] = useState('')
  const [format, setFormat] = useState('auto')
  const [experience, setExperience] = useState('intermediate')
  const [constraints, setConstraints] = useState('')
  const [output, setOutput] = useState('')
  const [scores, setScores] = useState(null)
  const { generate, loading, loadingText } = useGenerate()

  async function run() {
    if (!niche || !audience || !idea) { alert('Please fill in your niche, audience, and idea.'); return }

    const ideaData = { niche, audience, idea, format, experience, constraints }
    onIdeaSave(ideaData)

    const system = `You are VEGA, an expert digital product strategist. Be direct, specific, and practical. No generic advice. Format responses with ## headers and bullet points. Always base analysis on the specific niche and idea provided.`

    const prompt = `Analyze this digital product idea:
Niche: ${niche}
Audience: ${audience}
Idea: ${idea}
Format preference: ${format === 'auto' ? 'Open to recommendations' : format}
Experience level: ${experience}
Constraints: ${constraints || 'None'}

Provide:
## Idea Assessment
Honest 2-3 sentence assessment of this idea's potential.

## Sellability Score
Rate 1-10 for each — Demand Score, Competition Score (10 = low competition), Profit Potential Score. One line each with brief reasoning.

## Your Strongest Angle
The specific positioning that makes this stand out from everything else in this niche. Be very specific.

## Recommended Format
Confirm or improve their format choice with clear reasoning.

## Quick Wins to Include
3 specific high-value elements buyers in this niche will immediately recognize as valuable.

## One Risk to Know
The single biggest challenge with this idea and exactly how to handle it.

Under 500 words. Be honest — if the idea needs refining, say so.`

    try {
      const result = await generate({
        system, prompt,
        loadingMessages: ['Analyzing your idea...', 'Checking audience fit...', 'Scoring sellability...', 'Finding your angle...']
      })
      setOutput(result)
      setScores(extractScores(result))
      onComplete(1, result)
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <Card icon="✦" iconColor="violet" title="Your product idea" subtitle="Tell VEGA what you're thinking — vague is fine, we'll sharpen it.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <InputGroup label="Your niche or topic area">
          <Input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. Canva templates, productivity, pet care" />
        </InputGroup>
        <InputGroup label="Target audience">
          <Input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. freelance designers, new coaches, recipe bloggers" />
        </InputGroup>
      </div>

      <InputGroup label="Your rough idea" hint="or a problem your audience has">
        <Textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g. Canva templates for Instagram posts, or — my audience can't stay consistent on social media" />
      </InputGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <InputGroup label="Preferred product format">
          <Select value={format} onChange={e => setFormat(e.target.value)}>
            <option value="auto">Let VEGA decide (recommended)</option>
            <option value="pdf">PDF guide / ebook</option>
            <option value="template">Canva or digital template pack</option>
            <option value="spreadsheet">Spreadsheet / tracker</option>
            <option value="prompt pack">AI prompt pack</option>
            <option value="checklist">Checklist / swipe file</option>
            <option value="mini-course">Mini-course / video series</option>
            <option value="notion">Notion template</option>
          </Select>
        </InputGroup>
        <InputGroup label="Your experience in this niche">
          <Select value={experience} onChange={e => setExperience(e.target.value)}>
            <option value="beginner">Beginner — learning as I go</option>
            <option value="intermediate">Intermediate — some experience</option>
            <option value="advanced">Advanced — I know this well</option>
            <option value="expert">Expert / professional</option>
          </Select>
        </InputGroup>
      </div>

      <InputGroup label="Any constraints?" hint="optional">
        <Input value={constraints} onChange={e => setConstraints(e.target.value)} placeholder="e.g. No video, keep it simple, under 20 pages" />
      </InputGroup>

      <BtnRow>
        <BtnGenerate onClick={run} disabled={loading}>
          <span>✦</span> {loading ? 'Analyzing...' : 'Analyze my idea'}
        </BtnGenerate>
      </BtnRow>

      {loading && <LoadingState text={loadingText} />}

      <OutputBlock title="✦ Idea Analysis" contentId="step1Content" visible={!!output}>
        <div dangerouslySetInnerHTML={{ __html: formatOutput(output) }} />
        {scores && <ScoreGrid {...scores} />}
        <div style={{ marginTop: 20 }}>
          <BtnGenerate onClick={() => onNext(2)}>Continue to Validation →</BtnGenerate>
        </div>
      </OutputBlock>
    </Card>
  )
}

function extractScores(text) {
  const nums = (text.match(/\b([1-9]|10)(?:\/10|\s*out of\s*10)/gi) || []).map(n => parseInt(n))
  return { demand: nums[0] || 7, competition: nums[1] || 6, profit: nums[2] || 7 }
}
