import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { asset, contact, projects, studio, telHref, whatsappHref } from './content'
import type { Project } from './content'

const INTRO_KEY = 'srijan-intro-seen'
const INTRO_MS = 3400

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
 * screen fades away to reveal the page. Plays once per visit; any click or
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
      <img className="splash__mark" src={asset('/brand/mark-brand.png')} alt="" />
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
          <button type="button" className="slideshow__prev" onClick={() => go(-1)} aria-label="Previous photo">
            <span aria-hidden="true">←</span>
          </button>
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

const HERO_MS = 5000

/** Home hero: project covers that crossfade on their own, with a caption linking to each project. */
export function HeroSlides() {
  const slides = projects.map((project) => ({ src: project.images[0], project }))
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), HERO_MS)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  const current = slides[index].project

  return (
    <div className="hero-slides" aria-roledescription="carousel" aria-label="Featured projects">
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          className={`hero-slides__image${i === index ? ' is-active' : ''}`}
          src={slide.src}
          alt={i === index ? `${slide.project.title}, ${slide.project.location}` : ''}
          aria-hidden={i !== index}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <Link to={`/projects/${current.slug}`} className="hero-slides__caption" aria-live={paused ? 'polite' : 'off'}>
        <span>{current.title}</span>
        <span className="hero-slides__location">{current.location}</span>
      </Link>
      <button
        type="button"
        className="hero-slides__toggle"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? 'Play project slideshow' : 'Pause project slideshow'}
      >
        <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
      </button>
    </div>
  )
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link to={`/projects/${project.slug}`} className="project-card">
      <Photo src={project.images[0]} alt={`${project.title}, ${project.location}`} label={`Project ${String(index + 1).padStart(2, '0')} · photo`} />
      <div className="project-card__meta">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__info">
          {project.status ? `${project.status} · ` : ''}
          {project.category} · {project.location}
        </p>
      </div>
    </Link>
  )
}

const YEAR = new Date().getFullYear()

const NAV = [
  ['/', 'Home'],
  ['/projects', 'Projects'],
  ['/about', 'About'],
  ['/team', 'Team'],
] as const

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className={`header${open ? ' is-open' : ''}`}>
      <div className="wrap header__inner">
        <Link to="/" className="header__logo" aria-label={`${studio.name} — home`} onClick={() => setOpen(false)}>
          <img src={asset('/brand/logo-brand.png')} alt="" width="180" height="29" />
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
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="button button--small header__cta">
            Contact
          </NavLink>
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
          <img src={asset('/brand/logo-white.png')} alt={studio.name} className="footer__logo" />
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
          <Link to="/location" className="footer__link">
            Map &amp; directions
          </Link>
        </div>
        <div>
          <p className="label">Contact</p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          {contact.phones.map((phone) => (
            <a key={phone} href={telHref(phone)}>
              {phone}
            </a>
          ))}
          {whatsappHref() && (
            <a href={whatsappHref()} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          )}
        </div>
        <div>
          <p className="label">Follow</p>
          {contact.social.map((item) => (
            <a key={item.url} href={item.url} target="_blank" rel="noreferrer" aria-label={`${studio.name} on ${item.label} (opens in a new tab)`}>
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
      <WhatsAppButton />
    </>
  )
}

/** Floating WhatsApp chat button; appears once a WhatsApp number is set in content.ts. */
function WhatsAppButton() {
  const href = whatsappHref()
  if (!href) return null
  return (
    <a className="whatsapp" href={href} target="_blank" rel="noreferrer" aria-label="Chat with Studio Srijan on WhatsApp (opens in a new tab)">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"
        />
      </svg>
      <span>WhatsApp</span>
    </a>
  )
}
