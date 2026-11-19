import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { contact, studio, telHref } from './content'
import type { Project } from './content'

const INTRO_KEY = 'srijan-intro-seen'
const INTRO_MS = 3800

function shouldPlayIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(INTRO_KEY) === null
  } catch {
    return true
  }
}

/**
 * Opening animation: the Studio Srijan mark spins in the centre, then the
 * screen splits open to reveal the page. Plays once per visit; any click or
 * key skips it.
 */
// Decided once per page load, so re-mounting (e.g. React's dev double-mount) can't skip it.
const PLAY_INTRO = shouldPlayIntro()

function Intro() {
  const [visible, setVisible] = useState(PLAY_INTRO)

  useEffect(() => {
    if (!visible) return
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      // Storage unavailable: it will simply play again next time.
    }
    const close = () => setVisible(false)
    const timer = window.setTimeout(close, INTRO_MS)
    window.addEventListener('keydown', close)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', close)
      document.documentElement.style.overflow = ''
    }
  }, [visible])

  if (!visible) return null
  return (
    <div className="splash" aria-hidden="true" onClick={() => setVisible(false)}>
      <div className="splash__door splash__door--top" />
      <div className="splash__door splash__door--bottom" />
      <img className="splash__mark" src="/brand/mark-black.png" alt="" />
    </div>
  )
}

/** Image slot that shows a labelled neutral panel until a real photo is added. */
export function Photo({ src, alt, label = 'Photo', className = '' }: { src?: string; alt: string; label?: string; className?: string }) {
  if (src) return <img className={`photo ${className}`} src={src} alt={alt} loading="lazy" />
  return (
    <div className={`photo photo--placeholder ${className}`} role="img" aria-label={`${alt} (placeholder)`}>
      <span>{label}</span>
    </div>
  )
}

/**
 * One photo at a time with a next arrow on the right (loops back to the start).
 * Also works with the keyboard (← →, when focused) and by swiping on touch screens.
 */
export function Slideshow({ images, alt, count = 3 }: { images: string[]; alt: string; count?: number }) {
  const slides: (string | undefined)[] = images.length > 0 ? images : Array.from({ length: count }, () => undefined)
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const go = (step: number) => setIndex((current) => (current + step + slides.length) % slides.length)

  return (
    <div
      className="slideshow"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} photos`}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1)
        if (event.key === 'ArrowLeft') go(-1)
      }}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchX.current === null) return
        const dx = event.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
    >
      <div className="slideshow__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((src, i) => (
          <div
            key={i}
            className="slideshow__slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== index}
          >
            <Photo src={src} alt={`${alt}, photo ${i + 1}`} label={`Project photo ${i + 1}`} />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button type="button" className="slideshow__next" onClick={() => go(1)} aria-label="Next photo">
            <span aria-hidden="true">→</span>
          </button>
          <p className="slideshow__count" aria-live="polite">
            {index + 1} / {slides.length}
          </p>
        </>
      )}
    </div>
  )
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link to={`/projects/${project.slug}`} className="project-card">
      <Photo src={project.images[0]} alt={project.title} label={`Project ${String(index + 1).padStart(2, '0')} · photo`} />
      <div className="project-card__meta">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__info">
          {project.discipline} · {project.location}
        </p>
      </div>
    </Link>
  )
}

const YEAR = new Date().getFullYear()

const NAV = [
  ['/projects', 'Projects'],
  ['/team', 'Team'],
  ['/principal-architect', 'Principal Architect'],
  ['/location', 'Location'],
  ['/contact', 'Contact'],
] as const

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className={`header${open ? ' is-open' : ''}`}>
      <div className="wrap header__inner">
        <Link to="/" className="header__logo" aria-label={`${studio.name} — home`} onClick={() => setOpen(false)}>
          <img src="/brand/logo-black.png" alt="" width="180" height="29" />
        </Link>
        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="site-nav" className="header__nav" aria-label="Main" onClick={() => setOpen(false)}>
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div>
          <img src="/brand/logo-white.png" alt={studio.name} className="footer__logo" />
          <p className="footer__tagline">{studio.tagline}</p>
        </div>
        <div>
          <p className="label">Visit</p>
          <address>
            {contact.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p className="footer__muted">{contact.hours}</p>
        </div>
        <div>
          <p className="label">Contact</p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          {contact.phones.map((phone) => (
            <a key={phone} href={telHref(phone)}>
              {phone}
            </a>
          ))}
        </div>
        <div>
          <p className="label">Follow</p>
          {contact.social.map((item) => (
            <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <div className="wrap footer__base">
        © {YEAR} {studio.name}. Est. {studio.founded}.
      </div>
    </footer>
  )
}

export function Layout() {
  const { pathname, hash } = useLocation()
  // Start each page at the top, or at the section a link points to (e.g. #awards).
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <Intro />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
