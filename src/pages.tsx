import { Link, useParams, useSearchParams } from 'react-router-dom'
import { HeroSlides, Photo, ProjectCard, Slideshow } from './components'
import { usePageMeta } from './seo'
import { contact, mission, principal, projects, services, studio, telHref, values, vision } from './content'
import type { Category, MediaLink } from './content'

export { Contact } from './contact'

export function Home() {
  usePageMeta({
    description:
      'Studio Srijan is a New Delhi practice of architects, designers and engineers. Since 1996: architecture, interior design and project management for homes, farmhouses and developments across India.',
    path: '/',
  })
  return (
    <>
      <section className="hero">
        <HeroSlides />
        <div className="wrap hero__text">
          <p className="label">
            {studio.descriptor} · Est. {studio.founded} · New Delhi
          </p>
          <h1 className="display hero__title">
            {studio.statement[0]}
            <br />
            {studio.statement[1]}
          </h1>
          <p className="hero__description">{studio.description}</p>
          <div className="hero__actions">
            <Link to="/projects" className="button">
              Explore projects
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap section intro">
        <div>
          <p className="label">The studio</p>
          <p className="lead">{studio.intro}</p>
          <Link to="/about" className="arrow-link intro__link">
            About the studio
          </Link>
        </div>
        <Stats />
      </section>

      <section className="wrap section">
        <div className="section__head">
          <h2 className="heading">Selected projects</h2>
          <Link to="/projects" className="arrow-link">
            All projects
          </Link>
        </div>
        <div className="project-grid">
          {projects.slice(0, 6).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="wrap section">
        <h2 className="heading">What we do</h2>
        <Services />
        <p className="muted services__note">{studio.technology}</p>
      </section>

      <section className="wrap section">
        <PrincipalFeature />
        <div className="team-teaser">
          <Photo src={studio.team.photo} alt="The Studio Srijan team outside the studio" />
          <span className="team-teaser__text">
            <span className="label">The team</span>
            <span className="heading">{studio.stats[1].value} architects, designers and project managers</span>
          </span>
        </div>
      </section>

      <ContactBand />
    </>
  )
}

function Stats({ column = false }: { column?: boolean }) {
  return (
    <dl className={`stats${column ? ' stats--column' : ''}`}>
      {studio.stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** The studio's disciplines. */
function Services() {
  return (
    <ol className="services">
      {services.map((service, index) => (
        <li key={service.name} className="services__row">
          <span className="services__num">{String(index + 1).padStart(2, '0')}</span>
          <h3>{service.label ?? service.name}</h3>
          <p>{service.description}</p>
        </li>
      ))}
    </ol>
  )
}

/** Filters come from the categories the projects actually have. */
const CATEGORIES = [...new Set(projects.map((project) => project.category))]
const categorySlug = (category: Category) => category.toLowerCase().replace(/\s+/g, '-')

export function Projects() {
  // The selected filter lives in the URL (?type=farmhouses) so it can be linked to and shared.
  const [params, setParams] = useSearchParams()
  const filter = CATEGORIES.find((category) => categorySlug(category) === params.get('type')) ?? 'All'
  const shown = projects.filter((project) => filter === 'All' || project.category === filter)

  usePageMeta({
    title: 'Projects',
    description:
      'Residences, farmhouses and residential developments by Studio Srijan across New Delhi, Gurugram, Noida, Varanasi, Mathura and Coimbatore.',
    path: '/projects',
  })

  function choose(item: 'All' | Category) {
    setParams(item === 'All' ? {} : { type: categorySlug(item) }, { replace: true })
  }

  return (
    <section className="wrap page">
      <header className="page__head">
        <p className="label">Projects</p>
        <h1 className="display display--sm">Homes shaped by the cities they belong to.</h1>
        <p className="lead page__lead">{studio.residentialIntro}</p>
      </header>

      <div className="filters" role="group" aria-label="Filter projects by type">
        {(['All', ...CATEGORIES] as const).map((item) => (
          <button key={item} type="button" aria-pressed={filter === item} onClick={() => choose(item)}>
            {item}
            <span className="filters__count">{item === 'All' ? projects.length : projects.filter((p) => p.category === item).length}</span>
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="project-grid project-grid--three">
          {shown.map((project) => (
            <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />
          ))}
        </div>
      ) : (
        <div className="empty-tab">
          <p className="lead">{filter} projects are coming soon.</p>
          <p className="muted">
            In the meantime, <Link to="/contact">get in touch</Link> to see examples of our {filter.toLowerCase()} work.
          </p>
        </div>
      )}
    </section>
  )
}

export function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((project) => project.slug === slug)
  const project = projects[index] as (typeof projects)[number] | undefined
  usePageMeta({
    title: project ? `${project.title}, ${project.location}` : 'Project not found',
    description: project?.summary ?? 'This project could not be found.',
    path: project ? `/projects/${project.slug}` : '/projects',
    image: project?.images[0],
  })
  if (!project) return <NotFound />
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  return (
    <>
      <article className="page">
        <div className="wrap">
          <Link to="/projects" className="back-link">
            All projects
          </Link>
          <header className="detail__head">
            <h1 className="display display--sm">{project.title}</h1>
            <dl className="detail__facts">
              <div>
                <dt>Type</dt>
                <dd>{project.category}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>{project.discipline}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{project.status ?? (project.year ? `Completed ${project.year}` : 'Completed')}</dd>
              </div>
            </dl>
          </header>
        </div>

        <Slideshow key={project.slug} images={project.images} alt={`${project.title}, ${project.location}`} />

        <div className="wrap">
          <p className="lead detail__summary">{project.summary}</p>

          <nav className="project-nav" aria-label="More projects">
            <Link to={`/projects/${previous.slug}`} className="project-nav__link">
              <span className="label">← Previous</span>
              <span className="heading">{previous.title}</span>
            </Link>
            <Link to={`/projects/${next.slug}`} className="project-nav__link project-nav__link--next">
              <span className="label">Next →</span>
              <span className="heading">{next.title}</span>
            </Link>
          </nav>
        </div>
      </article>
      <ContactBand title="Planning something similar?" />
    </>
  )
}

export function About() {
  usePageMeta({
    title: 'About',
    description: `${studio.about.slice(0, 150)}…`,
    path: '/about',
  })
  return (
    <>
      <section className="wrap page">
        <header className="page__head">
          <p className="label">About us</p>
          <h1 className="display display--sm">{studio.tagline}</h1>
        </header>
        <div className="studio__intro">
          <div>
            <p className="lead">{studio.about}</p>
            <p className="about__intro">{studio.intro}</p>
          </div>
          <Stats column />
        </div>
      </section>

      <Approach />

      <section className="wrap section">
        <h2 className="heading">How we grew</h2>
        <ol className="timeline">
          {studio.growth.map((step) => (
            <li key={step.year}>
              <span className="timeline__year">{step.year}</span>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section">
        <h2 className="heading">What we do</h2>
        <Services />
        <p className="muted services__note">{studio.technology}</p>
      </section>

      <section className="wrap section">
        <PrincipalFeature />
      </section>

      <ContactBand />
    </>
  )
}

export function Team() {
  usePageMeta({
    title: 'Team',
    description: 'Meet the architects, designers and project managers of Studio Srijan, led by Principal Architect Gavish Sahni.',
    path: '/team',
  })
  return (
    <>
      <section className="wrap page">
        <header className="page__head">
          <p className="label">Team</p>
          <h1 className="display display--sm">From a team of two to a studio of fifty.</h1>
        </header>
        <figure className="team-photo team-photo--top">
          <Photo src={studio.team.photo} alt="The Studio Srijan team outside the studio" />
          <figcaption className="lead">{studio.team.text}</figcaption>
        </figure>
      </section>

      <section className="wrap section">
        <PrincipalFeature />
      </section>

      <ContactBand />
    </>
  )
}

/** Principal Architect feature with a recognition strip; used on Home and Team. */
function PrincipalFeature() {
  const [award, jury] = principal.awards
  const highlights = [
    { label: award.name, detail: `${award.detail}, ${award.year}`, href: '#awards' },
    { label: 'Author', detail: `${principal.book.title} (with ${principal.book.coAuthor})`, href: '#book' },
    { label: `${jury.name} jury`, detail: 'Jury panel for the last five years', href: '#awards' },
    { label: 'In the news', detail: 'Times of India, Forbes India', href: '#press' },
  ]

  return (
    <div className="feature">
      <Link to="/principal-architect" className="feature__portrait" tabIndex={-1} aria-hidden="true">
        <Photo src={principal.portrait} alt="" />
      </Link>
      <div className="feature__body">
        <p className="label">Founder &amp; {principal.role}</p>
        <h2 className="display display--sm">{principal.name}</h2>
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
    <section className="wrap section approach" aria-labelledby="vision-title">
      <p className="label" id="vision-title">
        Our vision
      </p>
      <p className="approach__mission">{vision.headline}</p>

      <div className="approach__grid">
        <div>
          <p className="label">Our mission</p>
          <p className="approach__vision">{mission}</p>
        </div>
        <ul className="values" aria-label="Our values">
          {values.map((value) => (
            <li key={value.name}>
              <h3>{value.name}</h3>
              <p className="values__source">{value.source}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function PrincipalArchitect() {
  const { book } = principal
  usePageMeta({
    title: `${principal.name}, ${principal.role}`,
    description: `${principal.bio} Awards, press and the book ${book.title}.`,
    path: '/principal-architect',
    image: principal.portrait,
  })
  const sections = [
    principal.videos.length > 0 && ['videos', 'Videos'],
    ['awards', 'Awards'],
    ['book', 'Book'],
    principal.podcasts.length > 0 && ['podcasts', 'Podcasts'],
    ['press', 'In the news'],
  ].filter(Boolean) as [string, string][]

  return (
    <>
      <section className="wrap page">
        <header className="principal">
          <Photo className="principal__portrait" src={principal.portrait} alt={principal.name} />
          <div>
            <p className="label">Founder &amp; {principal.role}</p>
            <h1 className="display display--sm">{principal.name}</h1>
            <p className="lead principal__bio">{principal.bio}</p>
            <ul className="principal__background">
              {principal.background.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <nav className="principal__jump" aria-label="On this page">
              {sections.map(([id, label]) => (
                <a key={id} href={`#${id}`}>
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </header>
      </section>

      {principal.videos.length > 0 && (
        <section id="videos" className="wrap section">
          <h2 className="heading">Featured videos</h2>
          <div className="videos">
            {principal.videos.map((video) => (
              <figure key={video.youtubeId}>
                <iframe
                  className="video"
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
                <figcaption>
                  <h3>{video.title}</h3>
                  {video.source && <p>{video.source}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section id="awards" className="wrap section">
        <h2 className="heading">Awards &amp; recognition</h2>
        <div className="awards-grid">
          {principal.awards.map((award) => (
            <figure key={award.name}>
              {award.image && <Photo className="awards-grid__image" src={award.image} alt={`${award.name}: ${award.detail}`} />}
              <figcaption>
                <span className="awards__year">{award.year}</span>
                <h3>{award.name}</h3>
                <p>{award.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="book" className="wrap section">
        <h2 className="heading">The book</h2>
        <div className="book">
          <Photo className="book__cover" src={book.cover} alt={`Cover of ${book.title}: ${book.subtitle}`} />
          <div>
            <h3 className="display display--sm">{book.title}</h3>
            <p className="book__subtitle">{book.subtitle}</p>
            <p className="lead book__text">{book.description}</p>
            {book.url && (
              <a href={book.url} target="_blank" rel="noreferrer" className="button">
                Get the book
              </a>
            )}
          </div>
        </div>
      </section>

      {principal.podcasts.length > 0 && (
        <section id="podcasts" className="wrap section">
          <h2 className="heading">Podcasts</h2>
          <MediaList items={principal.podcasts} action="Listen" />
        </section>
      )}

      <section id="press" className="wrap section">
        <h2 className="heading">In the news</h2>
        <div className="press-grid">
          {principal.press
            .filter((item) => item.image)
            .map((item) => (
              <figure key={item.title}>
                <Photo className="press-grid__image" src={item.image} alt={`${item.outlet}: ${item.title}`} />
                <figcaption>
                  <span className="media-list__outlet">{item.outlet}</span>
                  <h3>{item.title}</h3>
                  {item.date && <p>{item.date}</p>}
                </figcaption>
              </figure>
            ))}
        </div>
        <MediaList items={principal.press.filter((item) => !item.image)} action="Read" />
      </section>

      <ContactBand />
    </>
  )
}

function MediaList({ items, action }: { items: MediaLink[]; action: string }) {
  if (items.length === 0) return null
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
  usePageMeta({
    title: 'Location',
    description: `Visit Studio Srijan at ${contact.address.join(', ')}. ${contact.hours}.`,
    path: '/location',
  })
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

    </>
  )
}

function ContactBand({ title = 'Have a project in mind?' }: { title?: string }) {
  return (
    <section className="band">
      <div className="wrap band__inner">
        <h2 className="display display--sm">{title}</h2>
        <Link to="/contact" className="button button--light">
          Contact us
        </Link>
      </div>
    </section>
  )
}

export function NotFound() {
  usePageMeta({ title: 'Page not found', description: 'This page doesn’t exist.', path: '/' })
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
