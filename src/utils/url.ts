export const PROTOCOL = 'https://'

/**
 * Returns the full URL of the given domain
 * @param domain
 * @return Href value - string
 */
export default function getDomainHref(domain: string): string {
  if (!domain) {
    throw new Error('Domain is required')
  }

  const url = new URL(PROTOCOL + domain)

  return url.href
}
