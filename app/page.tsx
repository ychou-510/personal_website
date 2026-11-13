'use client'
import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { ArrowUpRight, FileText, Link2 } from 'lucide-react'
import { AnimatedLink } from '@/components/ui/animated-link'
import Image from 'next/image'
import { HIGHLIGHTED_AUTHORS, PROJECTS, type ProjectCategory } from './data'

type ProjectFilter = 'featured' | ProjectCategory

const PROJECT_FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'creators-ai', label: 'Content Creators' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'design', label: 'Design' },
]

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.4,
  ease: [0.25, 1, 0.5, 1],
}

const VARIANTS_PROJECT_ITEM = {
  hidden: { opacity: 0, y: -20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
    transition: {
      duration: 0.2,
    },
  },
}

export default function Personal() {
  const [projectFilter, setProjectFilter] =
    React.useState<ProjectFilter>('featured')

  const visibleProjects = PROJECTS.filter((project) =>
    projectFilter === 'featured'
      ? project.selected === true
      : project.category === projectFilter,
  ).sort((a, b) => b.year - a.year)

  return (
    <motion.main
      className="space-y-20"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <p className="text-muted-foreground max-w-xl text-base leading-7 sm:text-[1.02rem]">
            I&apos;m Yu-Ling (Ruby) Chou, a Computational Media PhD candidate at{' '}
            <AnimatedLink
              href="https://engineering.ucsc.edu/departments/computational-media/"
              isStatic
              imageSrc="/img/previews/ucsc-computational-media.png"
            >
              UC Santa Cruz
            </AnimatedLink>
            , working with{' '}
            <AnimatedLink href="https://people.ucsc.edu/~cfchung/">
              Prof. Chia-Fang (Christina) Chung
            </AnimatedLink>
            . I study how people navigate communication, care, and trust in
            everyday digital life. My work currently spans social media, content
            creators, digital well-being, and human-centered AI, with a broader
            interest in designing technology that better supports people and
            their relationships.
          </p>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="mb-5">
          <h3 className="font-display text-foreground text-xl font-semibold">
            Projects
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Explore my work by research area.
          </p>
        </div>
        <div className="-mx-1 mb-7 [scrollbar-width:none] overflow-x-auto px-1 [&::-webkit-scrollbar]:hidden">
          <div
            className="border-border/80 inline-flex min-w-max border-b"
            role="tablist"
            aria-label="Project categories"
          >
            {PROJECT_FILTERS.map((filter) => {
              const isActive = projectFilter === filter.id

              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setProjectFilter(filter.id)}
                  className={`relative px-3.5 pb-2.5 text-center text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006aad] sm:px-4 sm:text-sm ${
                    isActive
                      ? 'text-[#003c6c] dark:text-[#fdc700]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter.label}
                  {isActive && (
                    <motion.span
                      layoutId="active-project-category"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-t-full bg-current"
                      transition={{
                        type: 'spring',
                        bounce: 0.15,
                        duration: 0.45,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="grid gap-6 sm:gap-7">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((pub, index) => {
              const publicationLink = Object.entries(pub.links || {}).find(
                ([label]) => label.toLowerCase() !== 'pdf',
              )
              const isFirstAuthor = pub.authors.some(
                (author, authorIndex) =>
                  authorIndex === 0 && HIGHLIGHTED_AUTHORS.includes(author),
              )
              const detailHref =
                isFirstAuthor && pub.detail ? `/projects/${pub.id}` : undefined
              const pdfLink = pub.links?.pdf
              const projectSummary = pub.description || pub.detail?.summary
              const projectLabel =
                pub.award ||
                pub.badges?.[0] ||
                publicationLink?.[0] ||
                'Research project'

              return (
                <motion.article
                  key={pub.id}
                  className="group grid gap-4 sm:grid-cols-[minmax(0,1fr)_148px] sm:items-start sm:gap-6"
                  variants={VARIANTS_PROJECT_ITEM}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className="min-w-0">
                    <div className="text-muted-foreground mb-2 flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.07em] uppercase">
                      <span className="text-foreground/45 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">/</span>
                      <span>{projectLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{pub.year}</span>
                    </div>
                    <h4 className="font-display text-foreground text-[1.05rem] leading-snug font-semibold sm:text-lg">
                      {detailHref ? (
                        <Link
                          href={detailHref}
                          className="hover:text-brand-strong inline transition-colors duration-200"
                        >
                          {pub.title}
                          <ArrowUpRight className="ml-1.5 inline h-3.5 w-3.5 align-baseline transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      ) : (
                        pub.title
                      )}
                    </h4>
                    {projectSummary && (
                      <p className="text-muted-foreground mt-2 line-clamp-2 text-[0.8125rem] leading-5">
                        {projectSummary}
                      </p>
                    )}
                    {pub.topics && (
                      <div
                        className="mt-2 flex flex-wrap gap-1.5"
                        aria-label="Project topics"
                      >
                        {pub.topics.map((topic) => (
                          <span
                            key={topic}
                            className="bg-muted/70 text-muted-foreground rounded px-1.5 py-0.5 text-[0.64rem] leading-4 font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                    {(pdfLink || publicationLink) && (
                      <div className="mt-2.5 flex items-center gap-2">
                        {pdfLink && (
                          <a
                            href={pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-border/80 text-muted-foreground hover:border-brand-border hover:text-brand-strong inline-flex h-7 items-center justify-center gap-1.5 rounded-full border px-2.5 text-[0.7rem] font-semibold tracking-[0.04em] transition-colors"
                            aria-label={`Open PDF for ${pub.title}`}
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
                            className="border-border/80 text-muted-foreground hover:border-brand-border hover:text-brand-strong inline-flex h-7 items-center justify-center gap-1.5 rounded-full border px-2.5 text-[0.7rem] font-semibold tracking-[0.04em] transition-colors"
                            aria-label={`Open the published paper page for ${pub.title}`}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            Link
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  {pub.image && detailHref ? (
                    <Link
                      href={detailHref}
                      className="bg-muted block overflow-hidden rounded-md"
                      aria-label={`View ${pub.title}`}
                    >
                      <Image
                        src={pub.image}
                        alt=""
                        width={520}
                        height={360}
                        className="aspect-[16/9] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] sm:aspect-[4/3]"
                      />
                    </Link>
                  ) : pub.image ? (
                    <div className="bg-muted block overflow-hidden rounded-md">
                      <Image
                        src={pub.image}
                        alt=""
                        width={520}
                        height={360}
                        className="aspect-[16/9] w-full object-cover sm:aspect-[4/3]"
                      />
                    </div>
                  ) : null}
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.section>
    </motion.main>
  )
}
