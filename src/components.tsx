import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { contact, studio, telHref } from './content'
import type { Project } from './content'

/** Image slot that shows a labelled neutral panel until a real photo is added. */
export function Photo({ src, alt, label = 'Photo', className = '' }: { src?: string; alt: string; label?: string; className?: string }) {
  if (src) return <img className={`photo ${className}`} src={src} alt={alt} loading="lazy" />
  return (
    <div className={`photo photo--placeholder ${className}`} role="img" aria-label={`${alt} (placeholder)`}>
      <span>{label}</span>
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
  ['/studio', 'Studio'],
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
  const { pathname } = useLocation()
  // Start each page at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
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
