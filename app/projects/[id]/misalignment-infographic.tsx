'use client'

import Image from 'next/image'
import { useState } from 'react'

type Perspective = 'both' | 'creator' | 'audience'

const FINDINGS = [
  {
    id: 'timing',
    eyebrow: '01 / Timing',
    title: 'Delayed response vs. perceived avoidance',
    creator: [
      'Awareness may arrive after discussion has already spread.',
      'Creators may monitor sentiment or hesitate to make things worse.',
    ],
    audience: [
      'Silence can look like a deliberate attempt to wait out criticism.',
      'Audiences may expect early acknowledgment of the central concern.',
    ],
    takeaway:
      'A delay may reflect uncertainty, but it can also create suspicion.',
    details:
      'Creators described both unintentional and strategic delay. Audience judgments depended on what the silence appeared to communicate in context.',
    image: '/img/projects/influencer-controversy-finding-timing-v2.png',
    imageAlt:
      'Parallel timelines contrast creator awareness and deliberation with growing audience expectations.',
  },
  {
    id: 'audience',
    eyebrow: '02 / Audience scope',
    title: 'Core followers vs. broader public',
    creator: [
      'Trusted followers know the creator’s history and public identity.',
      'Familiar platforms can feel safer and easier to interpret.',
    ],
    audience: [
      'People beyond the core community may expect broader accountability.',
      'Those directly affected may feel overlooked or unheard.',
    ],
    takeaway:
      'The audience a creator trusts may not represent everyone affected by the controversy.',
    details:
      'Core followers are not necessarily uncritical, and broader audiences are not uniformly hostile. The tension concerns whose perspectives become most visible to the creator.',
    image: '/img/projects/influencer-controversy-finding-audience-v2.png',
    imageAlt:
      'A creator has strong connections to a familiar inner circle and weaker links to broader audiences.',
  },
  {
    id: 'openness',
    eyebrow: '03 / Emotional boundaries',
    title: 'Emotional protection vs. openness',
    creator: [
      'Reducing exposure can protect creators from distress and abuse.',
      'Pausing engagement may make continued participation sustainable.',
    ],
    audience: [
      'Deleted or disabled criticism can look like avoiding accountability.',
      'Audiences value room for questions and substantive disagreement.',
    ],
    takeaway:
      'Protecting mental well-being and remaining accountable can be difficult to balance.',
    details:
      'The study distinguishes legitimate criticism from personal attacks. Platform support should preserve meaningful concerns while reducing harmful exposure.',
    image: '/img/projects/influencer-controversy-finding-openness-v2.png',
    imageAlt:
      'A moderation boundary filters harmful comments while preserving a path for substantive criticism and accountability.',
  },
] as const

export function MisalignmentInfographic() {
  const [perspective, setPerspective] = useState<Perspective>('both')

  return (
    <div className="misalignment-infographic">
      <div className="perspective-control" aria-label="Highlight a perspective">
        <span>Highlight</span>
        {(['both', 'creator', 'audience'] as Perspective[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={perspective === option}
            onClick={() => setPerspective(option)}
          >
            {option === 'both'
              ? 'Both'
              : option === 'creator'
                ? 'Creator'
                : 'Audience'}
          </button>
        ))}
      </div>

      <div className="misalignment-list">
        {FINDINGS.map((finding) => {
          const creatorDimmed = perspective === 'audience'
          const audienceDimmed = perspective === 'creator'

          return (
            <article className="misalignment-row" key={finding.id}>
              <div className="misalignment-heading">
                <p>{finding.eyebrow}</p>
                <h3>{finding.title}</h3>
              </div>

              <div className="misalignment-comparison">
                <section
                  className={`perspective-panel creator-panel ${creatorDimmed ? 'is-dimmed' : ''}`}
                  aria-label="Creator perspective"
                >
                  <span className="perspective-label">Creator perspective</span>
                  <ul>
                    {finding.creator.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <div className="misalignment-diagram">
                  <Image
                    src={finding.image}
                    alt={finding.imageAlt}
                    width={1536}
                    height={1024}
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                </div>

                <section
                  className={`perspective-panel audience-panel ${audienceDimmed ? 'is-dimmed' : ''}`}
                  aria-label="Audience perspective"
                >
                  <span className="perspective-label">
                    Audience interpretation
                  </span>
                  <ul>
                    {finding.audience.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <p className="misalignment-takeaway">{finding.takeaway}</p>
              <details className="misalignment-details">
                <summary>More context</summary>
                <p>{finding.details}</p>
              </details>
            </article>
          )
        })}
      </div>
    </div>
  )
}
