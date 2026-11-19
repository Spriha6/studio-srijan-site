import { useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePageMeta } from './seo'
import { contact, enquiries, inquiryTypes, projectCategories, telHref, vendorCategories, whatsappHref } from './content'
import type { InquiryType } from './content'

type Status = 'idle' | 'sending' | 'sent' | 'opened-email' | 'error'
type Errors = Partial<Record<string, string>>

const isInquiryType = (value: string | null): value is InquiryType => inquiryTypes.some((type) => type.id === value)

/** Field labels, in the order they appear in the enquiry email. */
const LABELS: Record<string, string> = {
  company: 'Company',
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  location: 'Project location',
  category: 'Category',
  size: 'Budget / project size',
  website: 'Website',
  message: 'Message',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(data: FormData, type: InquiryType): Errors {
  const value = (key: string) => String(data.get(key) ?? '').trim()
  const errors: Errors = {}
  if (!value('name')) errors.name = type === 'vendor' ? 'Please enter a contact person.' : 'Please enter your name.'
  if (!value('email')) errors.email = 'Please enter your email address.'
  else if (!EMAIL.test(value('email'))) errors.email = 'Please check the email address.'
  const phoneDigits = value('phone').replace(/\D/g, '')
  if (!phoneDigits) errors.phone = 'Please enter a phone number so we can call you back.'
  else if (phoneDigits.length < 8 || phoneDigits.length > 15) errors.phone = 'Please check the phone number.'
  if (type === 'vendor' && !value('company')) errors.company = 'Please enter your company name.'
  if (type === 'vendor' && !value('category')) errors.category = 'Please choose a category.'
  if (value('message').length < 10) errors.message = 'Please tell us a little more (a sentence or two is fine).'
  return errors
}

function emailLink(data: FormData, type: InquiryType) {
  const typeLabel = inquiryTypes.find((item) => item.id === type)!.label
  const who = String(data.get('company') || data.get('name'))
  const lines = Object.keys(LABELS)
    .filter((key) => key !== 'message' && String(data.get(key) ?? '').trim())
    .map((key) => `${LABELS[key]}: ${String(data.get(key)).trim()}`)
  const body = `${String(data.get('message')).trim()}\n\n${lines.join('\n')}`
  const subject = `${typeLabel} enquiry from ${who}`
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function Field({ name, label, error, children }: { name: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      {children}
      {error && (
        <p className="field__error" id={`f-${name}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export function Contact() {
  const [params, setParams] = useSearchParams()
  const typeParam = params.get('type')
  const type: InquiryType = isInquiryType(typeParam) ? typeParam : 'project'
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const formRef = useRef<HTMLFormElement>(null)

  usePageMeta({
    title: type === 'vendor' ? 'Vendor & supplier enquiries' : 'Contact',
    description:
      'Start a project with Studio Srijan, architects, designers and engineers in Kirti Nagar, New Delhi. Call, email or send an enquiry. Vendors and collaborators welcome.',
    path: '/contact',
  })

  function chooseType(next: InquiryType) {
    setParams(next === 'project' ? {} : { type: next }, { replace: true })
    setErrors({})
    setStatus('idle')
  }

  const fieldProps = (name: string) => ({
    id: `f-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `f-${name}-error` : undefined,
  })

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const found = validate(data, type)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    // No form service yet: hand the enquiry to the visitor's email app.
    if (!enquiries.endpoint) {
      window.location.href = emailLink(data, type)
      setStatus('opened-email')
      return
    }

    setStatus('sending')
    data.set('inquiry_type', inquiryTypes.find((item) => item.id === type)!.label)
    data.set('subject', `${data.get('inquiry_type')} enquiry from ${data.get('company') || data.get('name')}`)
    if (enquiries.accessKey) data.set('access_key', enquiries.accessKey)
    try {
      const response = await fetch(enquiries.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error(String(response.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const whatsapp = whatsappHref()

  return (
    <section className="wrap page">
      <header className="page__head">
        <p className="label">Contact</p>
        <h1 className="display display--sm">
          {type === 'vendor' ? 'Introduce your company to the studio.' : 'Tell us about your project.'}
        </h1>
      </header>

      <div className="contact">
        <div>
          <fieldset className="inquiry-types">
            <legend>What is this about?</legend>
            {inquiryTypes.map((item) => (
              <label key={item.id} className={type === item.id ? 'is-active' : ''}>
                <input type="radio" name="inquiry-type" checked={type === item.id} onChange={() => chooseType(item.id)} />
                {item.label}
              </label>
            ))}
          </fieldset>

          {type === 'vendor' && (
            <p className="contact__intro">
              We welcome relevant product, material, manufacturing, contracting and professional collaborations. Tell us
              what you make or do, and the right person from the studio will get back to you if there’s a fit.
            </p>
          )}

          {status === 'sent' ? (
            <div className="form__done" role="status">
              <h2 className="heading">Thank you, your enquiry has been sent.</h2>
              <p className="muted">We’ll get back to you soon. If it’s urgent, call us on <a href={telHref(contact.phones[0])}>{contact.phones[0]}</a>.</p>
              <button type="button" className="arrow-link" onClick={() => setStatus('idle')}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate ref={formRef} key={type}>
              {type === 'vendor' && (
                <Field name="company" label="Company name" error={errors.company}>
                  <input {...fieldProps('company')} autoComplete="organization" />
                </Field>
              )}
              <Field name="name" label={type === 'vendor' ? 'Contact person' : 'Full name'} error={errors.name}>
                <input {...fieldProps('name')} autoComplete="name" />
              </Field>
              <div className="form__row">
                <Field name="email" label="Email" error={errors.email}>
                  <input {...fieldProps('email')} type="email" autoComplete="email" inputMode="email" />
                </Field>
                <Field name="phone" label="Phone" error={errors.phone}>
                  <input {...fieldProps('phone')} type="tel" autoComplete="tel" inputMode="tel" />
                </Field>
              </div>

              {type === 'project' && (
                <>
                  <div className="form__row">
                    <Field name="location" label="Project location (optional)">
                      <input {...fieldProps('location')} placeholder="e.g. Gurugram" />
                    </Field>
                    <Field name="category" label="Project type (optional)">
                      <select {...fieldProps('category')} defaultValue="">
                        <option value="">Choose…</option>
                        {projectCategories.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field name="size" label="Budget or project size (optional)">
                    <input {...fieldProps('size')} placeholder="e.g. 4,000 sq ft plot" />
                  </Field>
                </>
              )}

              {type === 'vendor' && (
                <div className="form__row">
                  <Field name="category" label="Product / service category" error={errors.category}>
                    <select {...fieldProps('category')} defaultValue="">
                      <option value="">Choose…</option>
                      {vendorCategories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </Field>
                  <Field name="website" label="Company website (optional)">
                    <input {...fieldProps('website')} type="url" inputMode="url" autoComplete="url" placeholder="https://" />
                  </Field>
                </div>
              )}

              <Field
                name="message"
                label={type === 'project' ? 'About the project' : type === 'vendor' ? 'Brief introduction' : 'Message'}
                error={errors.message}
              >
                <textarea {...fieldProps('message')} rows={5} />
              </Field>

              <button type="submit" className="button" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : enquiries.endpoint ? 'Send enquiry' : 'Continue in your email app'}
              </button>

              {!enquiries.endpoint && status === 'idle' && (
                <p className="form__note">This opens your email app with the enquiry written out, ready for you to send.</p>
              )}
              {status === 'opened-email' && (
                <p className="form__note" role="status">
                  Your email app should now be open with the enquiry ready. It isn’t sent until you press send there. If
                  nothing opened, write to us at <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </p>
              )}
              {status === 'error' && (
                <p className="form__note form__note--error" role="alert">
                  Sorry, your enquiry couldn’t be sent. Please try again, or email us at{' '}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </p>
              )}
            </form>
          )}
        </div>

        <div className="contact__details">
          <div>
            <p className="label">Call</p>
            {contact.phones.map((phone) => (
              <a key={phone} href={telHref(phone)}>
                {phone}
              </a>
            ))}
          </div>
          {whatsapp && (
            <div>
              <p className="label">WhatsApp</p>
              <a href={whatsapp} target="_blank" rel="noreferrer">
                Message us on WhatsApp
              </a>
            </div>
          )}
          <div>
            <p className="label">Email</p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <div>
            <p className="label">Office</p>
            <address>
              {contact.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <p className="muted">{contact.hours}</p>
            <Link to="/location" className="arrow-link">
              Map &amp; directions
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
