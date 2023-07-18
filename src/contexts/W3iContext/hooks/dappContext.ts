import { useEffect, useState } from 'react'

export const useDappContext = () => {
  const query = new URLSearchParams(window.location.search)
  const dappContextQuery = query.get('dappContext')
  const dappNameQuery = query.get('dappName')
  const dappIconQuery = query.get('dappIcon')
  const dappNotificationDescriptionQuery = query.get('dappNotificationDescription')

  const [dappContext] = useState<string>(dappContextQuery ?? '')
  const [dappName] = useState<string>(dappNameQuery ?? '')
  const [dappIcon] = useState<string>(dappIconQuery ?? '')
  const [dappNotificationDescription] = useState<string>(dappNotificationDescriptionQuery ?? '')

  return { dappContext, dappName, dappIcon, dappNotificationDescription }
}
