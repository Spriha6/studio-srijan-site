/**
 * All of the firm's content lives here, so the site can be updated without
 * touching any layout code.
 *
 * Text and images come from the Studio Srijan company profile, plus contact
 * details from the current studiosrijan.com. Images live in /public.
 */

/** Public file path that also works when the site is served from a sub-folder (e.g. GitHub Pages). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export type Category = 'Residences' | 'Farmhouses' | 'Residential complex'

export type Discipline = 'Architecture' | 'Interior Design' | 'Management'

/** URL-friendly name, e.g. "Interior Design" → "interior-design". */
export const disciplineSlug = (discipline: Discipline) => discipline.toLowerCase().replace(/\s+/g, '-')

export interface Project {
  slug: string
  title: string
  discipline: Discipline
  category: Category
  location: string
  /** e.g. "Upcoming". Omit for completed work. */
  status?: string
  summary: string
  /** Paths under /public; the first image is the cover. */
  images: string[]
}

export const studio = {
  name: 'Studio Srijan',
  tagline: 'Designing Lifestyle, Building Trust',
  descriptor: 'Architects, Designers and Engineers',
  intro:
    'With close to three decades of experience, Studio Srijan has built a reputation as a leading design consultancy and project management firm. Our accolades and media features underscore the trust we have built over the years.',
  about:
    'Studio Srijan is an architectural and interior design firm founded by Gavish Sahni. He has led the firm in designing a diverse range of prestigious projects across India, from luxury residences to large-scale commercial developments. Studio Srijan has earned a reputation as a trustworthy firm providing excellent design consultancy and exceptional construction management.',
  founded: 1996,
  stats: [
    { value: '~30', label: 'Years of practice' },
    { value: '50', label: 'Architects, designers and project managers' },
    { value: '80', label: 'Projects a year' },
  ],
  growth: [
    { year: '1997', text: 'A team of two, taking on three or four projects a year.' },
    { year: '2008', text: 'A team of 20, delivering around 20 projects a year.' },
    { year: '2018', text: 'Evolved into a collective of qualified architects and interior designers.' },
    { year: 'Today', text: 'A dedicated team of 50, delivering 80 projects a year.' },
  ],
  team: {
    photo: asset('/people/team.jpg'),
    text: 'Studio Srijan is a premier design firm dedicated to creating exceptional spaces. Our team of architects, designers and project managers brings a wealth of creativity and expertise to every project.',
  },
  technology:
    'We design for each client’s unique needs using the latest technology, like 3D views and VR, and are working on the Rdash platform for data visualisation and analytics.',
  residentialIntro:
    'We take great pride in crafting residential projects that resonate with the cultural and aesthetic essence of the cities they’re located in. Across diverse locations, our work showcases innovation, luxury and deep respect for local context. While many stand complete, others are shaping the future of residential living.',
}

export const vision = {
  headline: 'To be the most trusted design firm in India.',
  text: 'To be a leader in architectural innovation, creating iconic and sustainable designs that harmonise with nature and transform the way people live, work and interact with their environments.',
}

export const mission = 'Our mission is to strive for creativity, clarity and control to excel in every project.'

export const values = [
  {
    name: 'Creativity',
    source: 'from curiosity and learning',
    text: 'By focusing on innovative and unique design solutions, we create visually stunning and functional spaces that satisfy our clients’ needs.',
  },
  {
    name: 'Clarity',
    source: 'from intention and consciousness',
    text: 'Clarity and transparency in communication, internally and with clients, ensure project goals, timelines and expectations are well understood.',
  },
  {
    name: 'Control',
    source: 'from consistent improvement and transformation',
    text: 'Maintaining control over a project’s scope, budget and schedule is key to successful outcomes. Effective project management leads to high-quality results.',
  },
]

// Disciplines named on studiosrijan.com; descriptions follow the company profile.
export const services: { name: Discipline; description: string }[] = [
  {
    name: 'Architecture',
    description: 'From luxury residences and farmhouses to large-scale residential and commercial developments.',
  },
  {
    name: 'Interior Design',
    description: 'Interiors designed alongside the architecture, so every space works as one.',
  },
  {
    name: 'Management',
    description: 'Design consultancy and construction management that keep scope, budget and schedule under control.',
  },
]

const images = (folder: string) => [asset(`/projects/${folder}/1.jpg`), asset(`/projects/${folder}/2.jpg`)]

export const projects: Project[] = [
  {
    slug: 'dera-mandi-farm-house',
    title: 'Dera Mandi Farm House',
    discipline: 'Architecture',
    category: 'Farmhouses',
    location: 'New Delhi',
    summary: 'Blending modern design with nature’s serenity — a farmhouse in Delhi NCR that redefines luxury and tranquility.',
    images: images('dera-mandi'),
  },
  {
    slug: 'gurugram-villas',
    title: 'Gurugram Villas',
    discipline: 'Architecture',
    category: 'Residences',
    location: 'Gurugram, NCR',
    summary: 'Exclusive villas and high-end residences that exemplify luxury and innovation.',
    images: images('gurugram'),
  },
  {
    slug: 'varanasi-residences',
    title: 'Varanasi Residences',
    discipline: 'Architecture',
    category: 'Residences',
    location: 'Varanasi',
    summary: 'Soulful residences that reflect the city’s spiritual essence, blending traditional aesthetics with contemporary living comforts.',
    images: images('varanasi'),
  },
  {
    slug: 'coimbatore-residential-complex',
    title: 'Coimbatore Residential Complex',
    discipline: 'Architecture',
    category: 'Residential complex',
    location: 'Coimbatore',
    status: 'Upcoming',
    summary: 'Nestled amid the serene beauty of Coimbatore, this upcoming residential complex is a landmark project that redefines luxury living on a grand scale. Spanning a vast area, it is designed to harmonise modern architecture with the tranquil charm of nature.',
    images: images('coimbatore'),
  },
  {
    slug: 'new-delhi-residences',
    title: 'New Delhi Residences',
    discipline: 'Architecture',
    category: 'Residences',
    location: 'New Delhi',
    summary: 'A wide array of residential projects for every taste — from the ultra-luxurious to independent farmhouses for those seeking exclusivity.',
    images: images('new-delhi-1'),
  },
  {
    slug: 'noida-residences',
    title: 'Noida Residences',
    discipline: 'Architecture',
    category: 'Residences',
    location: 'Noida, NCR',
    summary: 'Distinctive elevations that make a strong first impression through refined proportions, elegant detailing and timeless character.',
    images: images('noida-1'),
  },
  {
    slug: 'mathura-residence',
    title: 'Mathura Residence',
    discipline: 'Architecture',
    category: 'Residences',
    location: 'Mathura, Uttar Pradesh',
    summary: 'Set in the spiritual and cultural heart of India, this residence is a harmonious union of tradition and modernity.',
    images: images('mathura'),
  },
  {
    slug: 'noida-contemporary-residence',
    title: 'Contemporary Residence',
    discipline: 'Architecture',
    category: 'Residences',
    location: 'Noida, NCR',
    summary: 'Contemporary elevations with bold geometric forms, balanced proportions and a harmonious blend of textures, materials and natural elements.',
    images: images('noida-2'),
  },
  {
    slug: 'noida-farm-house',
    title: 'Noida Farm House',
    discipline: 'Architecture',
    category: 'Farmhouses',
    location: 'Noida, NCR',
    summary: 'Blending modern design with nature’s serenity — a farmhouse that redefines luxury and tranquility.',
    images: images('farm-house-noida'),
  },
  {
    slug: 'new-delhi-facades',
    title: 'Classical Facades',
    discipline: 'Architecture',
    category: 'Residences',
    location: 'New Delhi',
    summary: 'Elegant façades that combine clean architectural lines with subtle detailing, creating a refined and visually cohesive identity.',
    images: images('new-delhi-2'),
  },
]

export const contact = {
  address: ['9/45, Block 9, Kirti Nagar Industrial Area', 'Kirti Nagar, New Delhi, Delhi 110015'],
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=9%2F45+Block+9+Kirti+Nagar+Industrial+Area+New+Delhi+110015',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=9%2F45+Block+9+Kirti+Nagar+Industrial+Area+New+Delhi+110015',
  mapEmbedUrl: 'https://maps.google.com/maps?q=9%2F45+Block+9+Kirti+Nagar+Industrial+Area+New+Delhi+110015&z=15&output=embed',
  hours: 'Monday – Saturday, 09:30 – 18:30',
  phones: ['011-45520647', '+91 92059 23170', '+91 72899 41937'],
  email: 'dgm.studiosrijan@gmail.com',
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/studiosrijan/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/studio-srijan/' },
    { label: 'Facebook', url: 'https://www.facebook.com/p/Studio-Srijan-100064842410089/' },
    { label: 'X / Twitter', url: 'https://twitter.com/studiosrijan' },
  ],
}

/** Indian numbers as tel: links: "011-45520647" → tel:+911145520647, "+91 92059 23170" → tel:+919205923170. */
export const telHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.replace(/^0/, '')
  return `tel:+91${local}`
}

// ---------------------------------------------------------------------------
// Principal Architect
// ---------------------------------------------------------------------------

export interface Video {
  title: string
  /** YouTube video id (the part after "v=" in the link). */
  youtubeId: string
  source?: string
}

export interface Award {
  name: string
  detail: string
  year: string
  image?: string
}

export interface MediaLink {
  /** Show or publication name. */
  outlet: string
  title: string
  date: string
  url?: string
  image?: string
}

export const principal = {
  name: 'Gavish Sahni',
  role: 'Principal Architect',
  portrait: asset('/people/gavish-sahni.jpg'),
  bio: 'Gavish Sahni founded Studio Srijan and has led it for nearly three decades, from a team of two to a studio of fifty.',
  background: [
    'Degree in Architecture and Planning, IIT Roorkee (1987–1993).',
    'Worked with renowned architect Mike Whitekar on a five-star hotel in Delhi-NCR (1993–1996).',
    'Founded Studio Srijan, leading projects across India from luxury residences to large-scale commercial developments.',
  ],
  // Add feature videos here as they're shared; the section appears automatically.
  videos: [] as Video[],
  awards: [
    {
      name: 'Times Business Awards',
      detail: 'Best Architect in Residential Projects',
      year: '2018',
      image: asset('/press/times-business-award-2018.jpg'),
    },
    {
      name: 'FOAID India',
      detail: 'Member of the jury panel for the last five years',
      year: 'Jury',
      image: asset('/press/foaid-jury.jpg'),
    },
  ] as Award[],
  book: {
    title: 'Riser Within Me',
    subtitle: 'Power of Peer Coaching',
    coAuthor: 'Pravin Khandelwal',
    description: 'Co-authored with Pravin Khandelwal and inspired by the principles of the Art of Living.',
    cover: asset('/press/riser-within-me.jpg'),
    url: undefined as string | undefined,
  },
  // Add podcast episodes here as they're shared; the section appears automatically.
  podcasts: [] as MediaLink[],
  press: [
    {
      outlet: 'Times of India · Delhi Times',
      title: 'Creating thoughtful, original spaces',
      date: '1 June 2017',
      image: asset('/press/delhi-times-2017.jpg'),
    },
    { outlet: 'Forbes India', title: 'Featured in Forbes India', date: '' },
    {
      outlet: 'Marmo Solutions',
      title: 'Architectural Innovation — featured panel, New Delhi',
      date: '19 October 2024',
      image: asset('/press/architectural-innovation.jpg'),
    },
  ] as MediaLink[],
}
