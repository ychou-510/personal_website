'use client'
import { AnimatedBackground } from '@/components/ui/animated-background'
import Image from 'next/image'
import {
  Camera,
  Cat,
  Coffee,
  GraduationCap,
  Linkedin,
  MoonIcon,
  SunIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { EMAIL, PERSONAL_INFO, SOCIAL_LINKS } from './data'

const THEMES_OPTIONS = [
  {
    label: 'Light',
    id: 'light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: 'Dark',
    id: 'dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
]

const RESEARCH_BUDDIES = [
  {
    src: '/img/cats/cat-golden-head.png',
    alt: 'Lemon Tart, also called Tata',
    name: 'Lemon Tart',
    nickname: 'Tata',
    birthday: '2025-05-30',
  },
  {
    src: '/img/cats/cat-cream-head.png',
    alt: 'Mascarpone, also called Ponepone',
    name: 'Mascarpone',
    nickname: 'Ponepone',
    birthday: '2025-07-25',
  },
  {
    src: '/img/cats/cat-orange-head.png',
    alt: 'Bombolone, also called Bobo',
    name: 'Bombolone',
    nickname: 'Bobo',
    birthday: '2026-05-10',
  },
]

function formatAge(birthday: string) {
  const [year, month, day] = birthday.split('-').map(Number)
  const today = new Date()
  let totalMonths =
    (today.getFullYear() - year) * 12 + (today.getMonth() + 1 - month)

  if (today.getDate() < day) totalMonths -= 1
  totalMonths = Math.max(totalMonths, 0)

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts = []

  if (years) parts.push(`${years} yr${years === 1 ? '' : 's'}`)
  if (months || !years) parts.push(`${months} month${months === 1 ? '' : 's'}`)

  return parts.join(' ')
}

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatedBackground
      className="bg-muted pointer-events-none rounded-[var(--radius-lg)]"
      defaultValue={resolvedTheme}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.4,
      }}
      enableHover={true}
    >
      {THEMES_OPTIONS.map((themeOption) => {
        return (
          <button
            key={themeOption.id}
            className={`text-muted-foreground inline-flex h-7 w-7 cursor-pointer items-center justify-center transition-colors duration-200 focus-visible:outline-2 ${
              themeOption.id === 'light'
                ? 'hover:text-amber-500 data-[checked=true]:text-amber-500'
                : 'hover:text-blue-700 data-[checked=true]:text-blue-700'
            }`}
            type="button"
            aria-label={`${themeOption.label} theme`}
            aria-pressed={resolvedTheme === themeOption.id}
            data-id={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
          >
            {themeOption.icon}
          </button>
        )
      })}
    </AnimatedBackground>
  )
}

export function Footer() {
  return (
    <footer className="border-border/80 mt-20 border-t px-0 py-8">
      <div className="grid gap-7 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] sm:gap-10">
        <div>
          <h3 className="font-display text-foreground text-lg font-semibold">
            Connect
          </h3>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            For research conversations and collaborations, email me at{' '}
            <a
              className="text-brand-strong decoration-brand/40 hover:decoration-brand underline underline-offset-2 transition-colors"
              href={`mailto:${EMAIL}`}
            >
              {EMAIL}
            </a>
            .
          </p>
          <div className="mt-3 flex items-center gap-5">
            {SOCIAL_LINKS.map((link) => {
              const Icon =
                link.icon === 'GraduationCap' ? GraduationCap : Linkedin

              return (
                <a
                  key={link.label}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-brand-strong inline-flex items-center gap-1.5 text-xs transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-foreground text-xs font-semibold tracking-[0.08em] uppercase">
            Outside research
          </p>
          <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photography
            </span>
            <span className="inline-flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Making coffee &amp; tea
            </span>
            <span className="inline-flex items-center gap-2">
              <Cat className="h-4 w-4" />
              Cat lover
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex shrink-0 -space-x-2"
            aria-label="My three cats and research buddies"
          >
            {RESEARCH_BUDDIES.map((cat) => (
              <div
                key={cat.src}
                className="group relative h-12 w-12 hover:z-20"
                aria-label={`${cat.name}, ${cat.nickname}, girl, ${formatAge(cat.birthday)}`}
              >
                <Image
                  src={cat.src}
                  alt={cat.alt}
                  width={56}
                  height={56}
                  className="h-12 w-12 origin-bottom object-contain drop-shadow-[0_2px_2px_rgb(0_0_0/0.08)] transition-transform duration-200 ease-out group-hover:scale-110"
                />
                <div className="font-rounded border-border/80 bg-background text-foreground pointer-events-none absolute bottom-[calc(100%+0.75rem)] left-0 w-max max-w-52 translate-y-1 rounded-xl border px-3 py-2 opacity-0 shadow-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs font-semibold whitespace-nowrap">
                    {cat.name} ({cat.nickname})
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[0.68rem]">
                    <span
                      className="text-sm leading-none text-pink-500"
                      aria-hidden="true"
                    >
                      ♀
                    </span>
                    <span className="text-pink-500">girl</span>
                    <span className="text-muted-foreground" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-muted-foreground">
                      {formatAge(cat.birthday)}
                    </span>
                  </p>
                  <span className="border-border/80 bg-background absolute -bottom-2 left-5 h-2.5 w-2.5 rounded-full border" />
                  <span className="border-border/80 bg-background absolute -bottom-4 left-3 h-1.5 w-1.5 rounded-full border" />
                </div>
              </div>
            ))}
          </div>
          <div className="font-rounded self-center">
            <p className="text-foreground text-xs font-semibold tracking-[0.08em] uppercase">
              My research buddies
            </p>
          </div>
        </div>
        <div className="text-muted-foreground flex shrink-0 items-center justify-between gap-3 text-xs sm:justify-end">
          <span>© 2026 {PERSONAL_INFO.name.english}</span>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  )
}
