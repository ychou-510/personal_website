'use client'
import Image from 'next/image'
import { motion } from 'motion/react'
import { PERSONAL_INFO } from './data'

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.4,
  ease: [0.25, 1, 0.5, 1],
}

export function Header() {
  return (
    <header className="mb-10 flex items-center justify-between">
      <div className="flex flex-col gap-4">
        <motion.div
          variants={VARIANTS_SECTION}
          initial="hidden"
          animate="visible"
          transition={TRANSITION_SECTION}
        >
          <div
            className="profile-flip h-28 w-28"
            tabIndex={0}
            aria-label={`${PERSONAL_INFO.name.english} portrait; hover or focus to see the line illustration`}
          >
            <div className="profile-flip-inner h-full w-full">
              <div className="profile-flip-face profile-flip-front">
                <Image
                  src="/img/profile-cutout-square-crop-v4.jpg"
                  alt={PERSONAL_INFO.name.english}
                  fill
                  sizes="112px"
                  className="profile-theme-image profile-theme-image-light object-cover"
                  priority
                />
                <Image
                  src="/img/profile-cutout-square-crop-v4-dark.png"
                  alt=""
                  fill
                  sizes="112px"
                  className="profile-theme-image profile-theme-image-dark object-cover"
                  aria-hidden="true"
                />
              </div>
              <div
                className="profile-flip-face profile-flip-back bg-background"
                aria-hidden="true"
              >
                <Image
                  src="/img/profile-line-art-v1.png"
                  alt=""
                  fill
                  sizes="112px"
                  className="profile-theme-image profile-theme-image-light scale-[1.18] object-contain"
                />
                <Image
                  src="/img/profile-line-art-v1-dark.png"
                  alt=""
                  fill
                  sizes="112px"
                  className="profile-theme-image profile-theme-image-dark scale-[1.18] object-contain"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={VARIANTS_SECTION}
          initial="hidden"
          animate="visible"
          transition={TRANSITION_SECTION}
        >
          <div
            className="name-rewrite text-foreground text-3xl leading-none"
            tabIndex={0}
            aria-label={`${PERSONAL_INFO.name.english}; hover or focus to see the Chinese name ${PERSONAL_INFO.name.chinese}`}
          >
            <span className="name-rewrite-inner">
              <span className="name-rewrite-face name-rewrite-english name-display">
                {PERSONAL_INFO.name.english}
              </span>
              <span
                className="name-rewrite-face name-rewrite-chinese name-display-chinese"
                aria-hidden="true"
              >
                {Array.from(PERSONAL_INFO.name.chinese).map(
                  (character, index) => (
                    <span key={`${character}-${index}`}>{character}</span>
                  ),
                )}
              </span>
            </span>
          </div>
          <div className="text-muted-foreground mt-2 text-sm">
            {PERSONAL_INFO.title}
          </div>
        </motion.div>
      </div>
    </header>
  )
}
