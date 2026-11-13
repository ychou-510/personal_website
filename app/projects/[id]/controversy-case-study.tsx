import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react'
import type { Project } from '../../data'
import { HIGHLIGHTED_AUTHORS } from '../../data'
import { MisalignmentInfographic } from './misalignment-infographic'

const CONTEXT_STAGES = [
  'Creator action',
  'Public criticism',
  'Discussion spreads',
  'Response decision',
  'Audience interpretation',
] as const

const CREATOR_CONSIDERATIONS = [
  'Assess public sentiment and decide whether a response is needed.',
  'Protect professional relationships and a carefully built public identity.',
  'Choose which audiences and platforms should receive a response.',
  'Seek emotional support while managing criticism and uncertainty.',
]

const CREATOR_CHALLENGES = [
  [
    'Late awareness',
    'The controversy may spread before the creator notices it.',
  ],
  [
    'Feedback overload',
    'Useful criticism can be buried among repetitive or harmful comments.',
  ],
  [
    'Emotional burden',
    'Sustained criticism and personal attacks can be distressing.',
  ],
  [
    'Missing context',
    'Engagement metrics rarely explain why people are reacting negatively.',
  ],
] as const

const AUDIENCE_CRITERIA = [
  [
    'Reach the right people',
    'Address affected parties and relevant audiences.',
  ],
  [
    'Address the core issue',
    'Respond to the concern rather than offering a vague statement.',
  ],
  [
    'Make context accessible',
    'Provide explanations people can understand and evaluate.',
  ],
  [
    'Acknowledge responsibility',
    'Recognize wrongdoing and express remorse when warranted.',
  ],
  [
    'Show meaningful change',
    'Communicate correction, learning, or improvement.',
  ],
  ['Speak with care', 'Balance authenticity with prudence and context.'],
  [
    'Remain open to feedback',
    'Leave room for questions and substantive criticism.',
  ],
] as const

const DESIGN_OPPORTUNITIES = [
  {
    number: '01',
    title: 'Earlier controversy awareness',
    body: 'Surface emerging concerns and explain why public sentiment may be changing.',
  },
  {
    number: '02',
    title: 'Understand different audiences',
    body: 'Compare feedback across loyal followers, newcomers, and affected communities.',
  },
  {
    number: '03',
    title: 'Preserve criticism, reduce harm',
    body: 'Help creators find substantive concerns without equating criticism with abuse.',
  },
  {
    number: '04',
    title: 'Encourage constructive feedback',
    body: 'Prompt people to name the issue and suggest actionable change without personal attacks.',
  },
] as const

export function ControversyCaseStudy({ project }: { project: Project }) {
  const paperLink = project.links?.["CSCW '26"]
  const pdfLink = project.links?.pdf

  return (
    <main className="controversy-story">
      <Link href="/" className="controversy-back-link">
        <ArrowLeft aria-hidden="true" /> All projects
      </Link>

      <article>
        <header className="controversy-hero">
          <div className="controversy-kicker">
            <span>CSCW 2026</span>
            <span>Qualitative HCI research</span>
          </div>
          <h1>
            When creators face backlash, why do responses sometimes make things
            worse?
          </h1>
          <p className="controversy-deck">
            When controversy unfolds, what creators intend to communicate and
            what audiences understand are not always the same.
          </p>

          <figure className="controversy-hero-visual">
            <Image
              src="/img/projects/influencer-controversy-lavender-hero-v2.png"
              alt="A creator dashboard, a controversial social media post, and diverging audience interpretations connected by mismatched communication paths"
              width={1536}
              height={1024}
              priority
              sizes="(max-width: 768px) 100vw, 960px"
            />
          </figure>

          <div className="controversy-paper-meta">
            <div>
              <p className="paper-label">Paper</p>
              <h2>{project.title}</h2>
              <p>
                {project.authors.map((author, index) => (
                  <span
                    key={author}
                    className={
                      HIGHLIGHTED_AUTHORS.includes(author) ? 'is-author' : ''
                    }
                  >
                    {author}
                    {index < project.authors.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
            <div className="paper-actions">
              {paperLink && (
                <a href={paperLink} target="_blank" rel="noreferrer">
                  <ExternalLink aria-hidden="true" /> Read the paper
                </a>
              )}
              {pdfLink && (
                <a href={pdfLink} target="_blank" rel="noreferrer">
                  <FileText aria-hidden="true" /> PDF
                </a>
              )}
            </div>
          </div>
        </header>

        <section
          className="controversy-section"
          aria-labelledby="context-heading"
        >
          <div className="section-intro">
            <p>01 / Research context</p>
            <h2 id="context-heading">A controversy is more than a bad post</h2>
            <div className="section-copy">
              <p>
                Influencers build visibility, relationships, reputation, and
                sometimes livelihoods through their online presence. When their
                own actions or statements become controversial, they must decide
                whether to respond, wait, or remain silent while public
                interpretation continues to evolve.
              </p>
              <p>
                These situations can involve legitimate questions of
                responsibility and accountability alongside overwhelming or
                harmful attacks.
              </p>
            </div>
          </div>

          <figure className="controversy-sequence">
            <figcaption>
              Illustrative sequence, not a universal process
            </figcaption>
            <Image
              className="generated-sequence-image"
              src="/img/projects/influencer-controversy-context-v2.png"
              alt="A social media post leads to public criticism, spreading discussion, a creator response decision, and multiple audience interpretations"
              width={2172}
              height={724}
              sizes="(max-width: 768px) 100vw, 960px"
            />
            <div className="generated-sequence-labels" aria-hidden="true">
              {CONTEXT_STAGES.map((label) => (
                <strong key={label}>{label}</strong>
              ))}
            </div>
          </figure>
        </section>

        <section
          className="controversy-section method-story"
          aria-labelledby="method-heading"
        >
          <div className="section-intro">
            <p>02 / Method</p>
            <h2 id="method-heading">Two perspectives, one complex situation</h2>
            <div className="section-copy">
              <p>
                We conducted semi-structured interviews in a Mandarin-speaking
                East Asian context and analyzed the accounts iteratively using
                grounded-theory-informed qualitative analysis.
              </p>
              <p className="scope-note">
                The creator and audience groups were not matched pairs. Their
                accounts offer two complementary views of controversy
                management, not direct conversations with one another.
              </p>
            </div>
          </div>

          <div className="method-groups">
            <Image
              className="generated-method-image"
              src="/img/projects/influencer-controversy-method-v2.png"
              alt="Two separate participant groups contribute complementary creator and audience perspectives without being matched pairs"
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, 760px"
            />
            <article className="method-group creator-group">
              <span className="method-number">08</span>
              <div>
                <p>Creators</p>
                <h3>How did they decide whether and how to respond?</h3>
              </div>
            </article>
            <div className="method-question">
              <span />
              <p>Where do expectations and interpretations diverge?</p>
              <span />
            </div>
            <article className="method-group audience-group">
              <span className="method-number">14</span>
              <div>
                <p>Audience members</p>
                <h3>
                  How did they interpret and evaluate creators’ responses?
                </h3>
              </div>
            </article>
          </div>
        </section>

        <section
          className="controversy-section"
          aria-labelledby="perspectives-heading"
        >
          <div className="section-intro">
            <p>03 / Understanding each perspective</p>
            <h2 id="perspectives-heading">What happens behind a response?</h2>
          </div>

          <div className="perspective-story-grid">
            <section
              className="creator-story"
              aria-labelledby="creator-story-heading"
            >
              <span className="story-label">Creator perspective</span>
              <h3 id="creator-story-heading">
                A response is a decision under pressure
              </h3>
              <ul className="story-list">
                {CREATOR_CONSIDERATIONS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="challenge-grid">
                {CREATOR_CHALLENGES.map(([title, body], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              className="audience-story"
              aria-labelledby="audience-story-heading"
            >
              <span className="story-label">Audience perspective</span>
              <h3 id="audience-story-heading">
                What are audiences looking for?
              </h3>
              <div className="criteria-list">
                {AUDIENCE_CRITERIA.map(([title, body], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  </article>
                ))}
              </div>
              <p className="context-note">
                Expectations vary with the controversy’s severity, the creator’s
                reputation and reach, and the audience member’s prior
                relationship with them. These criteria are contextual, not a
                universal checklist.
              </p>
            </section>
          </div>
        </section>

        <section
          className="controversy-section findings-story"
          aria-labelledby="findings-heading"
        >
          <div className="section-intro is-centered">
            <p>04 / Key finding</p>
            <h2 id="findings-heading">
              The same response. Different interpretations.
            </h2>
            <div className="section-copy">
              <p>
                Our study reveals three important gaps between how influencers
                understand their response strategies and how audiences interpret
                those responses.
              </p>
            </div>
          </div>
          <MisalignmentInfographic />
        </section>

        <section
          className="controversy-section"
          aria-labelledby="implications-heading"
        >
          <div className="section-intro">
            <p>05 / Design implications</p>
            <h2 id="implications-heading">
              How could social media platforms help?
            </h2>
            <div className="section-copy">
              <p>
                These conceptual directions explore ways to support
                accountability and more sustainable creator–audience engagement.
                They are design opportunities, not implemented or evaluated
                products.
              </p>
            </div>
          </div>

          <div className="opportunity-grid">
            <Image
              className="generated-opportunities-image"
              src="/img/projects/influencer-controversy-opportunities-v2.png"
              alt="Four conceptual platform design directions: earlier awareness, understanding multiple audiences, preserving criticism while reducing harm, and encouraging constructive feedback"
              width={2172}
              height={724}
              sizes="(max-width: 768px) 100vw, 960px"
            />
            {DESIGN_OPPORTUNITIES.map((item) => (
              <article key={item.number}>
                <div className="opportunity-topline">
                  <span>{item.number}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <p className="oversight-note">
            Automated classification or summarization would require careful
            human oversight to avoid suppressing, distorting, or
            mischaracterizing legitimate criticism.
          </p>
        </section>

        <section
          className="controversy-closing"
          aria-labelledby="closing-heading"
        >
          <h2 id="closing-heading">
            Navigating controversy is not just about choosing the right
            response. It is also about understanding how that response will be
            interpreted.
          </h2>
          <p>
            By examining creators’ decisions alongside audience expectations,
            this research identifies opportunities for platforms to support
            accountability, meaningful feedback, and more sustainable
            interactions during controversy.
          </p>
          <p className="closing-scope">
            This qualitative study draws on a relatively small Mandarin-speaking
            East Asian sample. Its findings offer contextual insights rather
            than universally applicable rules.
          </p>
          {paperLink && (
            <a href={paperLink} target="_blank" rel="noreferrer">
              Read the CSCW 2026 paper <ExternalLink aria-hidden="true" />
            </a>
          )}
        </section>
      </article>
    </main>
  )
}
