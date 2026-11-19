/**
 * All of the firm's content lives here, so the site can be updated without
 * touching any layout code.
 *
 * Facts marked SOURCE come from the current studiosrijan.com.
 * Anything marked PLACEHOLDER still needs real content from the studio:
 * set `placeholder: false` (or remove the flag) once it's replaced.
 */

export type Discipline = 'Architecture' | 'Interior Design' | 'Management'

export interface Project {
  slug: string
  title: string
  discipline: Discipline
  location: string
  year: string
  summary: string
  /** Paths under /public, e.g. "/projects/house-01/cover.jpg". Empty = placeholder image. */
  images: string[]
  placeholder?: boolean
}

export interface Person {
  name: string
  role: string
  photo?: string
  placeholder?: boolean
}

// SOURCE: studiosrijan.com
export const studio = {
  name: 'Studio Srijan',
  tagline: 'Architects, Designers and Engineers',
  intro:
    'Since 1996, Studio Srijan has shaped homes, workplaces and interiors across India — bringing architecture, interior design and project management together under one roof.',
  founded: 1996,
  stats: [
    { value: '30+', label: 'Years of practice' },
    { value: '50+', label: 'Thinkers in the studio' },
    { value: '1000+', label: 'Projects delivered' },
  ],
  leadArchitect: 'Gavish Sahni',
}

// SOURCE: the three disciplines listed on studiosrijan.com.
// PLACEHOLDER: the one-line descriptions are drafts for the studio to confirm.
export const services: { name: Discipline; description: string }[] = [
  {
    name: 'Architecture',
    description: 'Buildings designed from first sketch to construction drawings — residential, commercial and institutional.',
  },
  {
    name: 'Interior Design',
    description: 'Interiors that carry the architecture inside, from space planning to materials, lighting and furniture.',
  },
  {
    name: 'Management',
    description: 'Project management that keeps budgets, timelines and contractors aligned through to handover.',
  },
]

// PLACEHOLDER: replace with real projects and photos from the studio.
export const projects: Project[] = [
  { slug: 'project-01', title: 'Project title', discipline: 'Architecture', location: 'City', year: 'Year', summary: 'A short description of the project, the brief and the studio’s approach.', images: [], placeholder: true },
  { slug: 'project-02', title: 'Project title', discipline: 'Interior Design', location: 'City', year: 'Year', summary: 'A short description of the project, the brief and the studio’s approach.', images: [], placeholder: true },
  { slug: 'project-03', title: 'Project title', discipline: 'Architecture', location: 'City', year: 'Year', summary: 'A short description of the project, the brief and the studio’s approach.', images: [], placeholder: true },
  { slug: 'project-04', title: 'Project title', discipline: 'Management', location: 'City', year: 'Year', summary: 'A short description of the project, the brief and the studio’s approach.', images: [], placeholder: true },
  { slug: 'project-05', title: 'Project title', discipline: 'Interior Design', location: 'City', year: 'Year', summary: 'A short description of the project, the brief and the studio’s approach.', images: [], placeholder: true },
  { slug: 'project-06', title: 'Project title', discipline: 'Architecture', location: 'City', year: 'Year', summary: 'A short description of the project, the brief and the studio’s approach.', images: [], placeholder: true },
]

// SOURCE: lead architect. PLACEHOLDER: the rest of the team.
export const team: Person[] = [
  { name: 'Gavish Sahni', role: 'Lead Architect' },
  { name: 'Team member', role: 'Role', placeholder: true },
  { name: 'Team member', role: 'Role', placeholder: true },
  { name: 'Team member', role: 'Role', placeholder: true },
]

// SOURCE: studiosrijan.com/contact
export const contact = {
  address: ['9/45, Block 9, Kirti Nagar Industrial Area', 'Kirti Nagar, New Delhi, Delhi 110015'],
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=9%2F45+Block+9+Kirti+Nagar+Industrial+Area+New+Delhi+110015',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=9%2F45+Block+9+Kirti+Nagar+Industrial+Area+New+Delhi+110015',
  mapEmbedUrl: 'https://maps.google.com/maps?q=9%2F45+Block+9+Kirti+Nagar+Industrial+Area+New+Delhi+110015&z=15&output=embed',
  hours: 'Monday – Saturday, 09:30 – 18:30',
  phones: ['011-25172517', '9205923170', '7289941937'],
  email: 'dgm.studiosrijan@gmail.com',
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/studiosrijan/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/studio-srijan/' },
    { label: 'Facebook', url: 'https://www.facebook.com/p/Studio-Srijan-100064842410089/' },
    { label: 'X / Twitter', url: 'https://twitter.com/studiosrijan' },
  ],
}

/** Indian numbers as international tel: links, e.g. 011-25172517 → tel:+911125172517. */
export const telHref = (phone: string) => `tel:+91${phone.replace(/\D/g, '').replace(/^0/, '')}`
