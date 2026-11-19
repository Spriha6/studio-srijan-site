import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Photo, ProjectCard, Slideshow } from './components'
import { contact, mission, principal, projects, services, studio, team, telHref, values, vision } from './content'
import type { MediaLink } from './content'
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

      <Approach />

      <section className="wrap section">
        <PrincipalFeature />
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

      <Slideshow key={project.slug} images={project.images} alt={project.title} />

      <div className="wrap">
        <p className="lead detail__summary">{project.summary}</p>

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
        <PrincipalFeature />
      </section>

      <section className="wrap section">
        <h2 className="heading">The team</h2>
        <ul className="team">
          {team
            .filter((person) => person.name !== principal.name)
            .map((person, index) => (
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

/** Principal Architect feature with a recognition strip; used on Home and Team. */
function PrincipalFeature({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const [award] = principal.awards
  const highlights = [
    { label: award.name, detail: [award.detail, award.year].join(' · '), href: '#awards' },
    { label: 'Author', detail: principal.book.title, href: '#book' },
    { label: 'Podcasts', detail: `${principal.podcasts.length} appearances`, href: '#podcasts' },
    { label: 'In the news', detail: `${principal.press.length} articles`, href: '#press' },
  ]

  return (
    <div className="feature">
      <Link to="/principal-architect" className="feature__portrait" tabIndex={-1} aria-hidden="true">
        <Photo src={principal.portrait} alt="" label="Portrait" />
      </Link>
      <div className="feature__body">
        <p className="label">Led by our {principal.role}</p>
        <Heading className="display display--sm">{principal.name}</Heading>
        <ul className="recognition" aria-label="Recognition">
          {highlights.map((item) => (
            <li key={item.label}>
              <Link to={`/principal-architect${item.href}`}>
                <span className="recognition__label">{item.label}</span>
                <span className="recognition__detail">{item.detail}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/principal-architect" className="arrow-link">
          Meet {principal.name}
        </Link>
      </div>
    </div>
  )
}

function Approach() {
  return (
    <section className="wrap section approach" aria-labelledby="approach-title">
      <p className="label" id="approach-title">
        Our mission
      </p>
      <p className="approach__mission">{mission}</p>

      <div className="approach__grid">
        <div>
          <p className="label">Our vision</p>
          <p className="approach__vision">{vision}</p>
        </div>
        <div>
          <p className="label">Our values</p>
          <ul className="values">
            {values.map((value) => (
              <li key={value.name}>
                <h3>{value.name}</h3>
                <p>{value.source}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function PrincipalArchitect() {
  const { book } = principal
  return (
    <>
      <section className="wrap page">
        <header className="principal">
          <Photo className="principal__portrait" src={principal.portrait} alt={principal.name} label="Portrait" />
          <div>
            <p className="label">{principal.role}</p>
            <h1 className="display display--sm">{principal.name}</h1>
            <p className="lead principal__bio">{principal.bio}</p>
            <nav className="principal__jump" aria-label="On this page">
              <a href="#videos">Videos</a>
              <a href="#awards">Awards</a>
              <a href="#book">Book</a>
              <a href="#podcasts">Podcasts</a>
              <a href="#press">In the news</a>
            </nav>
          </div>
        </header>
      </section>

      <section id="videos" className="wrap section">
        <h2 className="heading">Featured videos</h2>
        <div className="videos">
          {principal.videos.map((video, index) => (
            <figure key={index}>
              {video.youtubeId ? (
                <iframe
                  className="video"
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <Photo className="video" alt={video.title} label="Video" />
              )}
              <figcaption>
                <h3>{video.title}</h3>
                {video.source && <p>{video.source}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="awards" className="wrap section">
        <h2 className="heading">Awards &amp; recognition</h2>
        <ul className="awards">
          {principal.awards.map((award, index) => (
            <li key={index}>
              <span className="awards__year">{award.year}</span>
              <h3>{award.name}</h3>
              <p>{award.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="book" className="wrap section">
        <h2 className="heading">The book</h2>
        <div className="book">
          <Photo className="book__cover" src={book.cover} alt={`Cover of ${book.title}`} label="Book cover" />
          <div>
            <h3 className="display display--sm">{book.title}</h3>
            <p className="lead book__text">{book.description}</p>
            {book.url && (
              <a href={book.url} target="_blank" rel="noreferrer" className="button">
                Get the book
              </a>
            )}
          </div>
        </div>
      </section>

      <section id="podcasts" className="wrap section">
        <h2 className="heading">Podcasts</h2>
        <MediaList items={principal.podcasts} action="Listen" />
      </section>

      <section id="press" className="wrap section">
        <h2 className="heading">In the news</h2>
        <MediaList items={principal.press} action="Read" />
      </section>

      <ContactBand />
    </>
  )
}

function MediaList({ items, action }: { items: MediaLink[]; action: string }) {
  return (
    <ul className="media-list">
      {items.map((item, index) => {
        const body = (
          <>
            <span className="media-list__outlet">{item.outlet}</span>
            <span className="media-list__title">{item.title}</span>
            <span className="media-list__date">{item.date}</span>
            {item.url && <span className="media-list__action">{action} ↗</span>}
          </>
        )
        return (
          <li key={index}>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noreferrer" className="media-list__row">
                {body}
              </a>
            ) : (
              <div className="media-list__row">{body}</div>
            )}
          </li>
        )
      })}
    </ul>
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
