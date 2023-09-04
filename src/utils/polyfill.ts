import { Buffer } from 'buffer'

export const polyfill = () => {
  window.Buffer = Buffer
}
