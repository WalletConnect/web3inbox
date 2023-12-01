import React, { useEffect, useState } from 'react'

import Avatar from '@/components/account/Avatar'
import { isValidEnsDomain } from '@/utils/address'

import './SearchSuggestions.scss'

interface SearchSuggestionsProps {
  name: string
  onNameClick: (name: string) => void
}

const queryEnsSubgraph = async (beginsWith: string) => {
  const query = {
    query: `
		query lookup {
			domains(first: 4, where: {name_starts_with: "${beginsWith}", resolvedAddress_not: null}, orderBy: labelName, orderDirection: asc) {
				name
				resolver {
					addr {
						id
					}
				}
				owner {
					id
				}
			}
		}
	`
  }
  const url = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query)
  })

  const json: { data: { domains: { name: string }[] } } = await result.json()

  const names = json.data.domains.map(domain => domain.name)

  return names
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ name, onNameClick }) => {
  const [domains, setDomains] = useState<string[]>([])

  useEffect(() => {
    if (name.length > 2) {
      queryEnsSubgraph(name).then(setDomains)
    } else {
      setDomains([])
    }
  }, [name, setDomains])

  const shouldDisplay = name.length > 2 && !isValidEnsDomain(name) && domains.length > 0

  return (
    <div style={{ display: shouldDisplay ? 'flex' : 'none' }} className="SearchSuggestions">
      {domains.map(domain => (
        <div
          key={domain}
          className="SearchSuggestions__suggestion"
          onClick={() => onNameClick(domain)}
        >
          <Avatar width="1.5em" height="1.5em" address={domain} />
          {domain}
        </div>
      ))}
    </div>
  )
}

export default SearchSuggestions
