import { useEffect } from 'react'
import { SITE_URL, studio } from './content'

const DEFAULT_IMAGE = '/projects/dera-mandi/1.jpg'

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.content = value
}

/**
 * Per-page title, description, canonical URL and social preview tags.
 * `path` is the page's path on studiosrijan.com, e.g. "/projects".
 */
export function usePageMeta({ title, description, path, image }: { title?: string; description: string; path: string; image?: string }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${studio.name}` : `${studio.name} — ${studio.descriptor}, New Delhi`
    const url = `${SITE_URL}${path === '/' ? '/' : path}`
    // Social previews need an absolute image URL on the official domain.
    const imagePath = (image ?? DEFAULT_IMAGE).replace(import.meta.env.BASE_URL, '/').replace(/^\/?/, '/')
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', `${SITE_URL}${imagePath}`)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, image])
}
