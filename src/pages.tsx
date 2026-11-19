import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Photo, ProjectCard } from './components'
import { contact, projects, services, studio, team, telHref } from './content'
import type { Discipline } from './content'

export function Home() {
  return (
    <>
      <section className="hero">
        <Photo className="hero__image" alt="Featured Studio Srijan project" label="Featured project photo" />
        <div className="wrap hero__text">
          <p className="label">Est. {studio.founded} · New Delhi</p>
          <h1 className="display">{studio.tagline}</h1>
        </div>
      </section>

      <section className="wrap section intro">
        <p className="lead">{studio.intro}</p>
        <dl className="stats">
          {studio.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h2 className="heading">Selected work</h2>
          <Link to="/projects" className="arrow-link">
            All projects
          </Link>
        </div>
        <div className="project-grid">
          {projects.slice(0, 4).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="wrap section">
        <h2 className="heading">What we do</h2>
        <ol className="services">
          {services.map((service, index) => (
            <li key={service.name}>
              <span className="services__num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <ContactBand />
    </>
  )
}

const FILTERS: ('All' | Discipline)[] = ['All', 'Architecture', 'Interior Design', 'Management']

export function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const shown = projects.filter((project) => filter === 'All' || project.discipline === filter)

  return (
    <section className="wrap page">
      <header className="page__head">
        <p className="label">Projects</p>
        <h1 className="display display--sm">{studio.stats[2].value} projects across three decades.</h1>
      </header>

      <div className="filters" role="group" aria-label="Filter projects">
        {FILTERS.map((item) => (
          <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="project-grid project-grid--three">
        {shown.map((project) => (
          <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />
        ))}
      </div>
      {shown.length === 0 && <p className="muted">No projects in this category yet.</p>}
    </section>
  )
}

export function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((project) => project.slug === slug)
  const project = projects[index]
  if (!project) return <NotFound />
  const next = projects[(index + 1) % projects.length]
  const gallery = project.images.length > 1 ? project.images.slice(1) : [undefined, undefined]

  return (
    <article className="page">
      <div className="wrap">
        <Link to="/projects" className="back-link">
          All projects
        </Link>
        <header className="detail__head">
          <h1 className="display display--sm">{project.title}</h1>
          <dl className="detail__facts">
            <div>
              <dt>Discipline</dt>
              <dd>{project.discipline}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
        </header>
      </div>

      <Photo className="detail__cover" src={project.images[0]} alt={project.title} label="Main project photo" />

      <div className="wrap">
        <p className="lead detail__summary">{project.summary}</p>
        <div className="detail__gallery">
          {gallery.map((src, i) => (
            <Photo key={i} src={src} alt={`${project.title}, view ${i + 2}`} label="Project photo" />
          ))}
        </div>

        <Link to={`/projects/${next.slug}`} className="next-project">
          <span className="label">Next project</span>
          <span className="heading">{next.title}</span>
        </Link>
      </div>
    </article>
  )
}

export function Team() {
  return (
    <>
      <section className="wrap page">
        <header className="page__head">
          <p className="label">Team</p>
          <h1 className="display display--sm">The people behind thirty years of work.</h1>
        </header>
        <div className="studio__intro">
          <p className="lead">{studio.intro}</p>
          <dl className="stats stats--column">
            {studio.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="heading">People</h2>
        <ul className="team">
          {team.map((person, index) => (
            <li key={`${person.name}-${index}`}>
              <Photo src={person.photo} alt={person.name} label="Portrait" />
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <Photo className="wide-photo" alt="The Studio Srijan team" label="Team photo" />

      <section className="wrap section">
        <h2 className="heading">Disciplines</h2>
        <ol className="services">
          {services.map((service, index) => (
            <li key={service.name}>
              <span className="services__num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <ContactBand />
    </>
  )
}

export function Location() {
  return (
    <>
      <section className="wrap page">
        <header className="page__head">
          <p className="label">Location</p>
          <h1 className="display display--sm">Visit the studio in Kirti Nagar, New Delhi.</h1>
        </header>

        <div className="location">
          <div className="location__map">
            <iframe
              src={contact.mapEmbedUrl}
              title="Map showing Studio Srijan in Kirti Nagar, New Delhi"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="contact__details">
            <div>
              <p className="label">Address</p>
              <address>
                {contact.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <div className="location__links">
                <a href={contact.directionsUrl} target="_blank" rel="noreferrer" className="arrow-link">
                  Get directions
                </a>
                <a href={contact.mapUrl} target="_blank" rel="noreferrer" className="arrow-link">
                  Open in Maps
                </a>
              </div>
            </div>
            <div>
              <p className="label">Office hours</p>
              <p>{contact.hours}</p>
              <p className="muted">Closed on Sundays</p>
            </div>
            <div>
              <p className="label">Before you visit</p>
              <p>Call ahead so the right person is in the studio to meet you.</p>
              {contact.phones.map((phone) => (
                <a key={phone} href={telHref(phone)}>
                  {phone}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)

  // No server: compose the enquiry in the visitor's own email app.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = `Project enquiry from ${data.get('name')}`
    const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}${data.get('phone') ? `\n${data.get('phone')}` : ''}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section className="wrap page">
      <header className="page__head">
        <p className="label">Contact</p>
        <h1 className="display display--sm">Tell us about your project.</h1>
      </header>

      <div className="contact">
        <form className="form" onSubmit={submit}>
          <label>
            <span>Name</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            <span>Phone (optional)</span>
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={6} required />
          </label>
          <button type="submit" className="button">
            Send enquiry
          </button>
          {sent && (
            <p className="form__note" role="status">
              Your email app should open with the message ready to send. If it doesn’t, write to us at{' '}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
          )}
        </form>

        <div className="contact__details">
          <div>
            <p className="label">Office</p>
            <address>
              {contact.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <Link to="/location" className="arrow-link">
              Map &amp; directions
            </Link>
          </div>
          <div>
            <p className="label">Hours</p>
            <p>{contact.hours}</p>
          </div>
          <div>
            <p className="label">Phone</p>
            {contact.phones.map((phone) => (
              <a key={phone} href={telHref(phone)}>
                {phone}
              </a>
            ))}
          </div>
          <div>
            <p className="label">Email</p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactBand() {
  return (
    <section className="band">
      <div className="wrap band__inner">
        <h2 className="display display--sm">Have a project in mind?</h2>
        <Link to="/contact" className="button button--light">
          Start a conversation
        </Link>
      </div>
    </section>
  )
}

export function NotFound() {
  return (
    <section className="wrap page">
      <p className="label">404</p>
      <h1 className="display display--sm">This page doesn’t exist.</h1>
      <Link to="/" className="arrow-link">
        Back to home
      </Link>
    </section>
  )
}
