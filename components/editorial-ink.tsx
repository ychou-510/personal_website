type InkProps = {
  className?: string
  label?: string
}

type PersonPose = 'phone' | 'listen' | 'audience' | 'guarded'

export function InkPerson({
  className = '',
  label = 'A simplified person',
  pose = 'phone',
}: InkProps & { pose?: PersonPose }) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={`ink-illustration ${className}`}
      role="img"
      aria-label={label}
    >
      <path d="M78 63c2-25 18-40 41-40 26 0 43 18 41 45" />
      <path d="M83 57c16-6 28-18 34-31 8 14 21 24 39 29" />
      <path d="M88 62c-1 31 10 53 31 54 23 1 36-20 35-53" />
      <path d="M103 78l3 1m28-1 3 1m-21 18c6 4 11 4 16 0" />
      <path d="M96 119c-24 9-37 27-39 58m78-58c24 9 37 27 39 58" />
      <path d="M60 178c31-12 80-12 111 0" />
      {pose === 'phone' && (
        <>
          <path d="M73 146c15 0 28 7 39 20m33-22c-9 5-17 13-23 24" />
          <rect x="128" y="126" width="28" height="48" rx="3" />
          <path d="M137 132h10m-5 33h1" />
          <path d="M67 133c-9-12-12-24-8-35m99 20c12-12 17-25 16-39" />
        </>
      )}
      {pose === 'listen' && (
        <>
          <path d="M69 146c18-14 31-17 47-6m10 3c17-8 31-6 45 7" />
          <path d="M56 115c-8 8-10 18-7 30m128-29c7 9 8 19 4 30" />
          <path d="M153 89c15-8 28-7 40 2m-33 10c13-5 23-3 31 3" />
        </>
      )}
      {pose === 'audience' && (
        <>
          <path d="M65 143c22-13 36-13 53-2m6 1c20-10 35-8 49 4" />
          <path d="M51 116c-11 12-14 25-8 39m135-37c10 11 13 24 8 38" />
          <path d="M34 91c14-12 29-14 45-6m-38 17c12-6 23-6 34-1" />
        </>
      )}
      {pose === 'guarded' && (
        <>
          <path d="M71 139c18 9 31 21 41 37m35-38c-15 8-26 21-35 38" />
          <path d="M61 126c-13 13-17 28-13 45m124-44c12 13 16 28 12 45" />
          <path d="M98 143l16 17 30-35" />
        </>
      )}
      <path d="M47 72c-11-8-21-7-29 2m185-5c-10-7-19-6-27 2" />
    </svg>
  )
}

export function InkSpark({ className = '' }: InkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`ink-illustration ink-spark ${className}`}
      aria-hidden="true"
    >
      <path d="M24 4c1 11 7 18 19 20-12 2-18 8-19 20-2-12-8-18-20-20 12-2 18-9 20-20Z" />
    </svg>
  )
}

export function InkArrow({ className = '' }: InkProps) {
  return (
    <svg
      viewBox="0 0 120 50"
      className={`ink-illustration ink-arrow ${className}`}
      aria-hidden="true"
    >
      <path d="M5 34c28-20 60-23 101-9" />
      <path d="m93 13 14 12-18 7" />
    </svg>
  )
}

export function InkInterface({
  className = '',
  label = 'A simplified social media interface',
}: InkProps) {
  return (
    <svg
      viewBox="0 0 220 180"
      className={`ink-illustration ${className}`}
      role="img"
      aria-label={label}
    >
      <rect x="22" y="15" width="176" height="150" rx="5" />
      <circle cx="43" cy="35" r="8" />
      <path d="M59 31h61m-61 9h38" />
      <rect x="42" y="58" width="136" height="47" rx="3" />
      <path d="M53 72h74m-74 12h108m-108 12h86" />
      <path d="M43 124h47m-47 13h104m-104 13h76" />
      <path d="M164 121c10 0 18 8 18 18s-8 18-18 18" />
    </svg>
  )
}
