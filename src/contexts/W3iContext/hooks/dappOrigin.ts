import { useEffect, useState } from 'react'

export const useDappOrigin = () => {
  const query = new URLSearchParams(window.location.search)
  const dappOriginQuery = query.get('dappOrigin')
  const dappNameQuery = query.get('dappName')
  const dappIconQuery = query.get('dappIcon')
  const dappNotificationDescriptionQuery = query.get('dappNotificationDescription')

  const [dappOrigin] = useState<string>(dappOriginQuery ?? '')
  const [dappName] = useState<string>(dappNameQuery ?? '')
  const [dappIcon] = useState<string>(dappIconQuery ?? '')
  const [dappNotificationDescription] = useState<string>(dappNotificationDescriptionQuery ?? '')

  return { dappOrigin, dappName, dappIcon, dappNotificationDescription }
}
