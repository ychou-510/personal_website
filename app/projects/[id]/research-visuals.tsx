import Image from 'next/image'
import type { ProjectDetail } from '../../data'
import {
  InkArrow,
  InkInterface,
  InkPerson,
  InkSpark,
} from '@/components/editorial-ink'
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Clock3,
  Eye,
  HeartHandshake,
  Laptop,
  LockKeyhole,
  MessageCircle,
  MessageCircleWarning,
  MessagesSquare,
  Radio,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react'

type VisualConfig = {
  tension: [string, string, string]
  center: string
  method: [string, string, string]
  findings: [string, string, string]
  directions: [string, string, string]
  motivationCaption: string
  tensionCaption: string
}

const VISUAL_CONFIG: Record<string, VisualConfig> = {
  'ethical-ai-disclosure-health-creators': {
    tension: ['Transparency', 'Accountability', 'Relational care'],
    center: 'Contextual disclosure',
    method: [
      'Listen to audiences',
      'Compare health contexts',
      'Interpret expectations',
    ],
    findings: [
      'Information needs clarity',
      'Care needs sensitivity',
      'One label cannot fit all',
    ],
    directions: [
      'Match the context',
      'Keep accountability legible',
      'Preserve relational care',
    ],
    motivationCaption:
      'AI disclosure sits inside a relationship: audiences assess the content, the creator, and the care behind the interaction.',
    tensionCaption:
      'The design challenge is not choosing one value over another, but helping these values remain visible together.',
  },
  'influencer-controversy-management': {
    tension: [
      'Audience expectations',
      'Public accountability',
      'Emotional safety',
    ],
    center: 'Response strategy',
    method: [
      'Talk with creators',
      'Talk with audiences',
      'Compare perspectives',
    ],
    findings: [
      'Many pressures shape a reply',
      'Timing is read differently',
      'Self-protection is often invisible',
    ],
    directions: [
      'Clarify response timing',
      'Name the audience scope',
      'Support emotional boundaries',
    ],
    motivationCaption:
      'A controversy creates a flood of public demands, while the creator has to decide when, where, and whether to respond.',
    tensionCaption:
      'Creators and audiences encounter the same controversy from different positions, producing different expectations of a “good” response.',
  },
  'social-media-influencers-appeal': {
    tension: ['Autonomy', 'Everyday relevance', 'Perceived closeness'],
    center: 'Influencer appeal',
    method: [
      'Ask what people value',
      'Compare media figures',
      'Trace recurring qualities',
    ],
    findings: [
      'Autonomy feels distinctive',
      'Closeness shapes appeal',
      'Creators take multiple roles',
    ],
    directions: [
      'Look beyond reach',
      'Name relational value',
      'Describe autonomy and closeness',
    ],
    motivationCaption:
      'Influencers occupy a different social position from traditional media figures: independent in production, yet present in everyday life.',
    tensionCaption:
      'Appeal emerges from a combination of creator independence and felt connection, not from audience size alone.',
  },
  'attention-management-im-statuses': {
    tension: ['Attention boundaries', 'Social accountability', 'Privacy'],
    center: 'Visible focus status',
    method: [
      'Study status reactions',
      'Explore likely practices',
      'Map social tradeoffs',
    ],
    findings: [
      'Statuses can reassure',
      'Visibility can expose routines',
      'Sharing changes by context',
    ],
    directions: [
      'Explain availability',
      'Control what is exposed',
      'Adapt to relationships',
    ],
    motivationCaption:
      'A focus status can explain a delayed reply, but making a private attention choice visible also changes what others expect to know.',
    tensionCaption:
      'The same status can protect a boundary, meet a social obligation, and reveal more than a person intended.',
  },
  'read-receipt-practices': {
    tension: [
      'Sender interpretation',
      'Recipient circumstances',
      'Response pressure',
    ],
    center: 'Seen, no reply',
    method: [
      'Collect lived accounts',
      'Examine both sides',
      'Build grounded patterns',
    ],
    findings: [
      'Nonresponse has many causes',
      'Context shapes interpretation',
      'Visibility creates pressure',
    ],
    directions: [
      'Reduce ambiguity',
      'Leave room for delay',
      'Lower response pressure',
    ],
    motivationCaption:
      'One interface signal creates two different stories: the sender sees silence, while the recipient may simply be busy or not ready to reply.',
    tensionCaption:
      'A read receipt reveals that a message was opened, but it cannot explain the circumstances surrounding the lack of response.',
  },
}

function Frame({
  children,
  caption,
  label,
  className = '',
}: {
  children: React.ReactNode
  caption: string
  label: string
  className?: string
}) {
  return (
    <figure className={`research-visual ${className}`}>
      <div className="research-visual-label">{label}</div>
      <div className="research-visual-canvas">{children}</div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

const GENERATED_CONTROVERSY_VISUALS = {
  motivation: {
    src: '/img/projects/influencer-controversy-motivation-v1.png',
    alt: 'A creator weighing response timing, audience expectations, and emotional safety while comments arrive',
    label: 'A response decision under public pressure',
    caption:
      'A controversy creates a flood of public demands, while the creator has to decide when, where, and whether to respond.',
  },
  tension: {
    src: '/img/projects/influencer-controversy-tension-v1.png',
    alt: 'A creator and an audience member approaching the same response strategy from different perspectives',
    label: 'The central research tension',
    caption:
      'Creators and audiences encounter the same controversy from different positions, producing different expectations of a good response.',
  },
  method: {
    src: '/img/projects/influencer-controversy-method-v1.png',
    alt: 'Interviews with creators and audiences followed by a comparison of their perspectives',
    label: 'How the study moved from experience to insight',
    caption:
      'Creator and audience accounts were interpreted together to reveal where their expectations diverged.',
  },
  findings: {
    src: '/img/projects/influencer-controversy-findings-v1.png',
    alt: 'Three connected findings about response pressure, timing, and emotional self-protection',
    label: 'What the perspectives revealed',
    caption:
      'Pressure, timing, and self-protection help explain why a response that feels reasonable to a creator may be interpreted differently by an audience.',
  },
  design: {
    src: '/img/projects/influencer-controversy-design-v1.png',
    alt: 'A response interface connected to timing, audience scope, and emotional boundaries',
    label: 'From findings to design',
    caption:
      'Platform support can make timing, audience scope, and emotional boundaries more legible without demanding constant access to a creator.',
  },
} as const

function GeneratedControversyVisual({
  kind,
}: {
  kind: keyof typeof GENERATED_CONTROVERSY_VISUALS
}) {
  const visual = GENERATED_CONTROVERSY_VISUALS[kind]

  return (
    <Frame
      label={visual.label}
      caption={visual.caption}
      className="research-visual-wide generated-editorial-visual"
    >
      <Image
        src={visual.src}
        alt={visual.alt}
        width={1672}
        height={941}
        sizes="(max-width: 768px) 100vw, 720px"
        className="generated-editorial-image"
      />
    </Frame>
  )
}

function EthicalAIMotivation({ caption }: { caption: string }) {
  return (
    <Frame label="A disclosure is part of a relationship" caption={caption}>
      <div className="viz-flow-grid">
        <div className="viz-workspace">
          <div className="viz-window-bar">
            <span />
            <span />
            <span />
            <p>Health content draft</p>
          </div>
          <div className="viz-draft-lines">
            <span />
            <span />
            <span />
          </div>
          <div className="viz-ai-chip">
            <Bot aria-hidden="true" />
            AI-supported edit
          </div>
        </div>
        <ArrowRight className="viz-arrow" aria-hidden="true" />
        <div className="viz-disclosure-stack">
          <div className="viz-status-card">
            <ShieldCheck aria-hidden="true" />
            <div>
              <strong>Disclosure cue</strong>
              <span>How was AI involved?</span>
            </div>
          </div>
          <div className="viz-audience-row">
            <span>
              <Eye aria-hidden="true" />
              Understand
            </span>
            <span>
              <CheckCircle2 aria-hidden="true" />
              Evaluate
            </span>
            <span>
              <HeartHandshake aria-hidden="true" />
              Relate
            </span>
          </div>
        </div>
      </div>
    </Frame>
  )
}

export function EthicalAIHeroVisual() {
  return (
    <Frame
      label="Health content, AI support, and audience trust"
      caption="A disclosure is meaningful when it helps people understand where AI entered a health creator's work without flattening the relationship into a generic label."
      className="ethical-ai-hero-visual"
    >
      <div className="ethical-hero-scene">
        <div className="ethical-hero-creator">
          <div className="ethical-figure is-creator" aria-hidden="true">
            <span className="ethical-figure-hair" />
            <span className="ethical-figure-head" />
            <span className="ethical-figure-body" />
          </div>
          <div className="ethical-laptop" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p>Health creator</p>
        </div>

        <div className="ethical-hero-bridge" aria-hidden="true">
          <div className="ethical-ai-orbit">
            <Bot />
          </div>
          <span>AI-assisted draft</span>
        </div>

        <div className="ethical-hero-audience">
          <div className="ethical-disclosure-card">
            <ShieldCheck aria-hidden="true" />
            <div>
              <strong>About this post</strong>
              <span>AI helped shape this draft</span>
            </div>
          </div>
          <div className="ethical-audience-row" aria-hidden="true">
            <div className="ethical-figure is-audience-one">
              <span className="ethical-figure-head" />
              <span className="ethical-figure-body" />
            </div>
            <div className="ethical-figure is-audience-two">
              <span className="ethical-figure-head" />
              <span className="ethical-figure-body" />
            </div>
            <div className="ethical-figure is-audience-three">
              <span className="ethical-figure-head" />
              <span className="ethical-figure-body" />
            </div>
          </div>
          <p>Health audience</p>
        </div>
      </div>
    </Frame>
  )
}

export function EthicalAIScenarioVisual() {
  return (
    <Frame
      label="The same disclosure lands differently by context"
      caption="A clear disclosure can support accountability in informational moments while a thoughtful presentation can preserve care in emotionally sensitive ones."
      className="ethical-ai-scenario-visual"
    >
      <div className="ethical-scenario-grid">
        <div className="ethical-post-card">
          <div className="ethical-post-image" aria-hidden="true">
            <div className="ethical-figure is-post-creator">
              <span className="ethical-figure-hair" />
              <span className="ethical-figure-head" />
              <span className="ethical-figure-body" />
            </div>
            <span className="ethical-post-cross" />
          </div>
          <div className="ethical-post-copy">
            <span />
            <span />
            <span />
          </div>
          <div className="ethical-post-disclosure">
            <Bot aria-hidden="true" /> AI-assisted edit
          </div>
        </div>

        <div className="ethical-context-stack">
          <div className="ethical-context-card is-information">
            <div className="ethical-context-icon" aria-hidden="true">
              i
            </div>
            <div>
              <strong>Information</strong>
              <span>Make sources and responsibility clear.</span>
            </div>
          </div>
          <div className="ethical-context-card is-care">
            <HeartHandshake aria-hidden="true" />
            <div>
              <strong>Care</strong>
              <span>Be truthful without interrupting support.</span>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  )
}

function ControversyMotivation({ caption }: { caption: string }) {
  return (
    <Frame label="A response decision under public pressure" caption={caption}>
      <div className="viz-controversy-grid">
        <div
          className="viz-comment-field"
          aria-label="A flood of audience reactions"
        >
          <div className="viz-comment viz-comment-one">
            <MessageCircleWarning aria-hidden="true" /> Why no response?
          </div>
          <div className="viz-comment viz-comment-two">Address this.</div>
          <div className="viz-comment viz-comment-three">Too late?</div>
          <div className="viz-comment viz-comment-four">We need context.</div>
        </div>
        <div className="viz-creator-decision">
          <div className="viz-avatar">
            <UserRound aria-hidden="true" />
          </div>
          <div>
            <span>Creator</span>
            <strong>How should I respond?</strong>
          </div>
        </div>
        <div className="viz-decision-list">
          <span>
            <Clock3 aria-hidden="true" />
            Timing
          </span>
          <span>
            <UsersRound aria-hidden="true" />
            Audience
          </span>
          <span>
            <ShieldCheck aria-hidden="true" />
            Safety
          </span>
        </div>
      </div>
    </Frame>
  )
}

function CreatorDoodle({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 220"
      className={compact ? 'creator-doodle is-compact' : 'creator-doodle'}
      role="img"
      aria-label="A creator thinking about how to respond"
    >
      <path d="M82 75c-3-27 14-48 40-48 25 0 42 20 38 47" />
      <path d="M88 65c10-7 18-19 22-31 8 15 22 25 43 29" />
      <path d="M92 69c-2 31 7 54 29 55 22 1 35-21 33-53" />
      <path d="M105 83l2 1M136 83l2 1M116 100c6 4 11 4 16 0" />
      <path d="M104 126c-18 8-29 24-31 48M139 126c19 8 29 24 31 48" />
      <path d="M72 175c21-10 34-10 50-1 16-9 31-9 49 1" />
      <path d="M53 167c-11-18-12-35-3-50M188 167c12-18 12-36 3-51" />
      <path d="M45 118c-9 3-14 10-15 19M196 117c9 3 14 10 15 19" />
      <path d="M108 145c8 7 19 7 28 0" />
      <path d="M87 201c18-11 52-11 70 0" />
      <path d="M72 50c-16-10-24-3-27 10M170 48c16-9 25-2 27 11" />
    </svg>
  )
}

function ControversyTensionVisual({ config }: { config: VisualConfig }) {
  return (
    <Frame
      label="The central research tension"
      caption={config.tensionCaption}
      className="research-visual-wide controversy-editorial-visual"
    >
      <div className="ink-perspective-diagram">
        <div className="ink-perspective-side is-creator">
          <InkPerson pose="guarded" label="A creator protecting a boundary" />
          <span>Creator perspective</span>
          <strong>What can I safely sustain?</strong>
        </div>
        <div className="ink-perspective-center">
          <InkArrow className="is-forward" />
          <div>
            <MessageCircleWarning aria-hidden="true" />
            <strong>{config.center}</strong>
          </div>
          <InkArrow className="is-back" />
        </div>
        <div className="ink-perspective-side is-audience">
          <InkPerson
            pose="audience"
            label="An audience member seeking a response"
          />
          <span>Audience perspective</span>
          <strong>What response feels accountable?</strong>
        </div>
      </div>
      <div className="ink-value-strip">
        {config.tension.map((item, index) => (
          <span key={item}>
            <small>0{index + 1}</small>
            {item}
          </span>
        ))}
      </div>
    </Frame>
  )
}

function ControversyMethodVisual({
  config,
  approach,
}: {
  config: VisualConfig
  approach: string[]
}) {
  return (
    <Frame
      label="How the study moved from experience to insight"
      caption="Creator and audience accounts were interpreted together to reveal where their expectations diverged."
      className="research-visual-wide controversy-editorial-visual"
    >
      <ol className="ink-method-flow">
        {approach.slice(0, 3).map((item, index) => {
          return (
            <li key={item}>
              <span className="ink-step-number">0{index + 1}</span>
              <div className="ink-method-illustration">
                {index === 0 && (
                  <InkPerson
                    pose="listen"
                    label="An interview with a creator"
                  />
                )}
                {index === 1 && (
                  <InkPerson
                    pose="audience"
                    label="An interview with an audience member"
                  />
                )}
                {index === 2 && (
                  <>
                    <InkInterface label="Creator and audience accounts being compared" />
                    <Search aria-hidden="true" />
                  </>
                )}
              </div>
              <strong>{config.method[index]}</strong>
              <p>{item}</p>
              {index < 2 && <InkArrow />}
            </li>
          )
        })}
      </ol>
    </Frame>
  )
}

function ControversyFindingsVisual({
  config,
  findings,
}: {
  config: VisualConfig
  findings: string[]
}) {
  const icons = [MessagesSquare, Clock3, ShieldCheck]
  return (
    <Frame
      label="What the perspectives revealed"
      caption="The findings show why a response that feels reasonable to a creator can still be interpreted very differently by an audience."
      className="research-visual-wide controversy-editorial-visual"
    >
      <div className="ink-findings-list">
        {findings.slice(0, 3).map((finding, index) => {
          const Icon = icons[index]
          return (
            <article key={finding}>
              <span className="ink-finding-number">0{index + 1}</span>
              <div className="ink-finding-illustration">
                {index === 0 && (
                  <InkPerson
                    pose="phone"
                    label="A creator facing competing pressures"
                  />
                )}
                {index === 1 && (
                  <InkInterface label="A delayed response interpreted through a social media interface" />
                )}
                {index === 2 && (
                  <InkPerson
                    pose="guarded"
                    label="A creator setting an emotional boundary"
                  />
                )}
                <Icon aria-hidden="true" />
              </div>
              <div>
                <h3>{config.findings[index]}</h3>
                <p>{finding}</p>
              </div>
            </article>
          )
        })}
      </div>
    </Frame>
  )
}

function ControversyDesignVisual({
  config,
  contribution,
}: {
  config: VisualConfig
  contribution: ProjectDetail['contribution']
}) {
  return (
    <Frame
      label="From findings to design"
      caption="These opportunities focus on making response choices legible without demanding constant access to a creator."
      className="research-visual-wide controversy-editorial-visual"
    >
      <div className="ink-design-diagram">
        <div className="ink-interface-annotation">
          <InkInterface label="A platform interface with response-support features" />
          <span className="is-timing">
            <Clock3 aria-hidden="true" /> Timing
          </span>
          <span className="is-audience">
            <UsersRound aria-hidden="true" /> Audience scope
          </span>
          <span className="is-boundary">
            <ShieldCheck aria-hidden="true" /> Boundaries
          </span>
          <InkSpark className="is-accent" />
        </div>
        <div className="ink-design-copy">
          <p>{contribution}</p>
          <div>
            {config.directions.map((direction, index) => (
              <span key={direction}>
                <small>0{index + 1}</small>
                {direction}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  )
}

function InfluencerAppealMotivation({ caption }: { caption: string }) {
  return (
    <Frame label="Two different kinds of media presence" caption={caption}>
      <div className="viz-comparison-grid">
        <div className="viz-comparison-side is-traditional">
          <Radio aria-hidden="true" />
          <div>
            <span>Traditional media figure</span>
            <strong>Produced at a distance</strong>
          </div>
          <div className="viz-one-way">
            <ArrowDown aria-hidden="true" />
            One-way presence
          </div>
        </div>
        <div className="viz-versus">compared with</div>
        <div className="viz-comparison-side is-creator">
          <Smartphone aria-hidden="true" />
          <div>
            <span>Social-media influencer</span>
            <strong>Independent and everyday</strong>
          </div>
          <div className="viz-close-loop">
            <MessagesSquare aria-hidden="true" />
            Felt closeness
          </div>
        </div>
      </div>
    </Frame>
  )
}

function AttentionStatusMotivation({ caption }: { caption: string }) {
  return (
    <Frame
      label="When a private boundary becomes a social signal"
      caption={caption}
    >
      <div className="viz-status-scene">
        <div className="viz-phone-shell">
          <div className="viz-phone-top" />
          <div className="viz-contact-line">
            <span className="viz-contact-dot" />
            Alex Morgan
          </div>
          <div className="viz-focus-card">
            <Brain aria-hidden="true" />
            <div>
              <strong>Focus mode · 2–4 PM</strong>
              <span>Unable to see messages</span>
            </div>
          </div>
          <div className="viz-message-bubble">Hey, are you available?</div>
        </div>
        <div className="viz-visibility-panel">
          <div>
            <Eye aria-hidden="true" />
            <strong>Visible to others</strong>
          </div>
          <p>Explanation</p>
          <p>Expectation</p>
          <p>Personal routine</p>
          <div className="viz-privacy-note">
            <LockKeyhole aria-hidden="true" />
            How much should be shared?
          </div>
        </div>
      </div>
    </Frame>
  )
}

function ReadReceiptMotivation({ caption }: { caption: string }) {
  return (
    <Frame label="Two sides of the same unread silence" caption={caption}>
      <div className="viz-receipt-grid">
        <div className="viz-receipt-side">
          <span className="viz-side-label">Sender</span>
          <div className="viz-chat-card">
            <div className="viz-outgoing">Can you let me know?</div>
            <span>Seen 2:14 PM</span>
            <div className="viz-empty-reply">No reply</div>
          </div>
          <div className="viz-interpretation">
            <Clock3 aria-hidden="true" />
            Waiting and wondering
          </div>
        </div>
        <div className="viz-shared-signal">
          <Eye aria-hidden="true" />
          <span>Same signal</span>
        </div>
        <div className="viz-receipt-side">
          <span className="viz-side-label">Recipient</span>
          <div className="viz-context-card">
            <Laptop aria-hidden="true" />
            <div>
              <strong>Another context</strong>
              <span>Busy, unready, or planning to reply later</span>
            </div>
          </div>
          <div className="viz-interpretation">
            <Brain aria-hidden="true" />
            Attention is elsewhere
          </div>
        </div>
      </div>
    </Frame>
  )
}

export function MotivationVisual({ projectId }: { projectId: string }) {
  const caption = VISUAL_CONFIG[projectId]?.motivationCaption
  if (!caption) return null

  switch (projectId) {
    case 'ethical-ai-disclosure-health-creators':
      return <EthicalAIMotivation caption={caption} />
    case 'influencer-controversy-management':
      return <GeneratedControversyVisual kind="motivation" />
    case 'social-media-influencers-appeal':
      return <InfluencerAppealMotivation caption={caption} />
    case 'attention-management-im-statuses':
      return <AttentionStatusMotivation caption={caption} />
    case 'read-receipt-practices':
      return <ReadReceiptMotivation caption={caption} />
    default:
      return null
  }
}

export function TensionVisual({ projectId }: { projectId: string }) {
  const config = VISUAL_CONFIG[projectId]
  if (!config) return null

  if (projectId === 'influencer-controversy-management') {
    return <GeneratedControversyVisual kind="tension" />
  }

  return (
    <Frame
      label="The central research tension"
      caption={config.tensionCaption}
      className="research-visual-wide"
    >
      <div className="viz-tension-map">
        <div className="viz-tension-node is-top">
          <Sparkles aria-hidden="true" />
          <span>{config.tension[0]}</span>
        </div>
        <div className="viz-tension-node is-left">
          <ShieldCheck aria-hidden="true" />
          <span>{config.tension[1]}</span>
        </div>
        <div className="viz-tension-center">{config.center}</div>
        <div className="viz-tension-node is-right">
          <HeartHandshake aria-hidden="true" />
          <span>{config.tension[2]}</span>
        </div>
        <span className="viz-connector is-a" />
        <span className="viz-connector is-b" />
        <span className="viz-connector is-c" />
      </div>
    </Frame>
  )
}

export function MethodVisual({
  projectId,
  approach,
}: {
  projectId: string
  approach: string[]
}) {
  const config = VISUAL_CONFIG[projectId]
  if (!config) return null

  if (projectId === 'influencer-controversy-management') {
    return <GeneratedControversyVisual kind="method" />
  }

  const icons = [UsersRound, Search, Sparkles]

  return (
    <Frame
      label="How the study moved from experience to insight"
      caption="The research process connects lived experience with interpretation, then carries those insights into design questions."
      className="research-visual-wide"
    >
      <ol className="viz-method-flow">
        {approach.slice(0, 3).map((item, index) => {
          const Icon = icons[index]
          return (
            <li key={item}>
              <div className="viz-method-icon">
                <Icon aria-hidden="true" />
              </div>
              <span className="viz-method-number">0{index + 1}</span>
              <strong>{config.method[index]}</strong>
              <p>{item}</p>
              {index < 2 && (
                <ArrowRight className="viz-method-arrow" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </Frame>
  )
}

export function FindingsVisual({
  projectId,
  findings,
}: {
  projectId: string
  findings: string[]
}) {
  const config = VISUAL_CONFIG[projectId]
  if (!config) return null

  if (projectId === 'influencer-controversy-management') {
    return <GeneratedControversyVisual kind="findings" />
  }

  const icons = [Eye, MessagesSquare, Brain]

  return (
    <Frame
      label="What the perspectives revealed"
      caption="The findings are related: interface cues, social interpretation, and personal context shape one another."
      className="research-visual-wide"
    >
      <div className="viz-findings-grid">
        {findings.slice(0, 3).map((finding, index) => {
          const Icon = icons[index]
          return (
            <article key={finding} className={`viz-finding is-${index + 1}`}>
              <div className="viz-finding-topline">
                <span>0{index + 1}</span>
                <Icon aria-hidden="true" />
              </div>
              <h3>{config.findings[index]}</h3>
              <p>{finding}</p>
            </article>
          )
        })}
      </div>
    </Frame>
  )
}

export function DesignDirectionVisual({
  projectId,
  contribution,
}: {
  projectId: string
  contribution: ProjectDetail['contribution']
}) {
  const config = VISUAL_CONFIG[projectId]
  if (!config) return null

  if (projectId === 'influencer-controversy-management') {
    return <GeneratedControversyVisual kind="design" />
  }

  return (
    <Frame
      label="From findings to design"
      caption="These directions translate the study's contribution into questions that designers can carry into future systems."
      className="research-visual-wide"
    >
      <div className="viz-design-grid">
        <div className="viz-design-statement">
          <Sparkles aria-hidden="true" />
          <p>{contribution}</p>
        </div>
        <div className="viz-direction-list">
          {config.directions.map((direction, index) => (
            <div key={direction}>
              <span>0{index + 1}</span>
              <strong>{direction}</strong>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}
