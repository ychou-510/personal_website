import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, ExternalLink, FileText, Sparkles } from 'lucide-react'
import {
  HIGHLIGHTED_AUTHORS,
  PERSONAL_INFO,
  PROJECTS,
  SITE_URL,
} from '../../data'
import {
  DesignDirectionVisual,
  FindingsVisual,
  MethodVisual,
  MotivationVisual,
  TensionVisual,
} from './research-visuals'
import { ControversyCaseStudy } from './controversy-case-study'

type ProjectPageProps = {
  params: Promise<{
    id: string
  }>
}

function getFirstAuthorProject(id: string) {
  return PROJECTS.find(
    (project) =>
      project.id === id &&
      project.selected &&
      HIGHLIGHTED_AUTHORS.includes(project.authors[0]),
  )
}

export function generateStaticParams() {
  return PROJECTS.filter(
    (project) =>
      project.selected && HIGHLIGHTED_AUTHORS.includes(project.authors[0]),
  ).map((project) => ({ id: project.id }))
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params
  const project = getFirstAuthorProject(id)

  if (!project) return {}

  return {
    title: project.title,
    description:
      project.detail?.summary ??
      project.description ??
      `${project.title} by ${PERSONAL_INFO.name.english}`,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      title: project.title,
      description: project.detail?.summary ?? project.description,
      url: new URL(`/projects/${project.id}`, SITE_URL),
      images: project.image ? [{ url: project.image }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = getFirstAuthorProject(id)

  if (!project?.detail) notFound()

  const detail = project.detail
  const isControversyProject =
    project.id === 'influencer-controversy-management'

  if (isControversyProject) {
    return <ControversyCaseStudy project={project} />
  }

  const pdfLink = project.links?.pdf
  const publicationLink = Object.entries(project.links || {}).find(
    ([label]) => label.toLowerCase() !== 'pdf',
  )
  return (
    <main
      className={`case-study-page space-y-20 pb-8 ${
        isControversyProject ? 'controversy-sketch' : ''
      }`}
    >
      <Link
        href="/"
        className="text-muted-foreground hover:text-brand-strong inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All projects
      </Link>

      <article className="space-y-24">
        <header className="space-y-8">
          <div className="space-y-5">
            <div className="text-brand-strong flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold tracking-[0.12em] uppercase">
              <span>{project.year}</span>
              {project.badges?.map((badge) => (
                <span key={badge} className="flex items-center gap-2">
                  <span className="text-border" aria-hidden="true">
                    /
                  </span>
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="font-display text-foreground text-[2rem] leading-[1.16] font-semibold sm:text-[2.65rem]">
              {project.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {project.authors.map((author, index) => (
                <span key={author}>
                  {HIGHLIGHTED_AUTHORS.includes(author) ? (
                    <span className="text-foreground font-semibold">
                      {author}
                    </span>
                  ) : (
                    author
                  )}
                  {index < project.authors.length - 1 && ', '}
                </span>
              ))}
            </p>
            {project.topics && (
              <div className="flex flex-wrap gap-2">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-muted/70 text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {project.image ? (
            <figure className="case-study-breakout overflow-hidden rounded-md">
              <Image
                src={project.image}
                alt={`Editorial visual for ${project.title}`}
                width={1200}
                height={675}
                className="aspect-video w-full object-cover"
                priority
              />
              <figcaption className="text-muted-foreground mt-3 text-xs leading-5">
                {project.description}
              </figcaption>
            </figure>
          ) : null}

          <div className="grid gap-8 sm:grid-cols-[1.16fr_0.84fr] sm:items-start">
            <div>
              <p className="text-brand-strong mb-3 text-xs font-semibold tracking-[0.12em] uppercase">
                In brief
              </p>
              <p className="text-foreground text-lg leading-8">
                {detail.summary}
              </p>
            </div>
            <aside className="bg-brand-soft border-brand-border rounded-md border p-5">
              <Sparkles className="text-brand-strong mb-3 h-5 w-5" />
              <p className="text-brand-strong mb-2 text-[0.66rem] font-semibold tracking-[0.1em] uppercase">
                Research question
              </p>
              <p className="text-foreground text-sm leading-6">
                {detail.researchQuestion}
              </p>
            </aside>
          </div>

          {(pdfLink || publicationLink) && (
            <div className="flex flex-wrap gap-2">
              {pdfLink && (
                <a
                  href={pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border text-foreground hover:border-brand-border hover:text-brand-strong inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  PDF
                </a>
              )}
              {publicationLink && (
                <a
                  href={publicationLink[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border text-foreground hover:border-brand-border hover:text-brand-strong inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {publicationLink[0]}
                </a>
              )}
            </div>
          )}
        </header>

        <section
          aria-labelledby="motivation-heading"
          className="grid gap-8 sm:grid-cols-[0.72fr_1.28fr] sm:items-start"
        >
          <div className="sm:sticky sm:top-8">
            <p className="text-brand-strong text-xs font-semibold tracking-[0.12em] uppercase">
              Motivation
            </p>
            <h2
              id="motivation-heading"
              className="font-display text-foreground mt-2 text-2xl font-semibold"
            >
              The human tension behind the interface
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-7">
              {detail.whyItMatters}
            </p>
          </div>
          <MotivationVisual projectId={project.id} />
        </section>

        <section aria-labelledby="tension-heading">
          <div className="mb-8 max-w-xl">
            <p className="text-brand-strong text-xs font-semibold tracking-[0.12em] uppercase">
              Conceptual lens
            </p>
            <h2
              id="tension-heading"
              className="font-display text-foreground mt-2 text-2xl font-semibold"
            >
              What the study holds in view
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              The project examines several values at once, including the ones
              that can be difficult to satisfy together.
            </p>
          </div>
          <TensionVisual projectId={project.id} />
        </section>

        <section aria-labelledby="approach-heading">
          <div>
            <p className="text-brand-strong text-xs font-semibold tracking-[0.12em] uppercase">
              Approach
            </p>
            <h2
              id="approach-heading"
              className="font-display text-foreground mt-2 text-2xl font-semibold"
            >
              How we studied it
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-6">
              A compact view of how the project moved from people&apos;s lived
              experiences to a grounded interpretation.
            </p>
          </div>
          <div className="mt-8">
            <MethodVisual projectId={project.id} approach={detail.approach} />
          </div>
        </section>

        {project.conceptImage ? (
          <section aria-labelledby="scenario-heading">
            <div className="mb-8 max-w-xl">
              <p className="text-brand-strong text-xs font-semibold tracking-[0.12em] uppercase">
                Scenario
              </p>
              <h2
                id="scenario-heading"
                className="font-display text-foreground mt-2 text-2xl font-semibold"
              >
                The research idea in one scene
              </h2>
            </div>
            <figure className="case-study-breakout overflow-hidden rounded-md">
              <Image
                src={project.conceptImage}
                alt={`A visual explanation of ${project.title}`}
                width={1536}
                height={864}
                className="aspect-video w-full object-cover"
              />
              <figcaption className="text-muted-foreground mt-3 text-xs leading-5">
                {project.visualCaption ??
                  'A visual shorthand for the human tension at the center of this study.'}
              </figcaption>
            </figure>
          </section>
        ) : null}

        <section aria-labelledby="takeaways-heading">
          <div className="mb-8 max-w-xl">
            <p className="text-brand-strong text-xs font-semibold tracking-[0.12em] uppercase">
              What surfaced
            </p>
            <h2
              id="takeaways-heading"
              className="font-display text-foreground mt-2 text-2xl font-semibold"
            >
              Three connected findings
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              These findings are easier to understand as a relationship than as
              three isolated takeaways.
            </p>
          </div>
          <FindingsVisual projectId={project.id} findings={detail.findings} />
        </section>

        <section aria-labelledby="design-heading">
          <div className="mb-8 max-w-xl">
            <p className="text-brand-strong text-xs font-semibold tracking-[0.12em] uppercase">
              Design implications
            </p>
            <h2
              id="design-heading"
              className="font-display text-foreground mt-2 text-2xl font-semibold"
            >
              Carrying the insight forward
            </h2>
          </div>
          <DesignDirectionVisual
            projectId={project.id}
            contribution={detail.contribution}
          />
        </section>
      </article>
    </main>
  )
}
