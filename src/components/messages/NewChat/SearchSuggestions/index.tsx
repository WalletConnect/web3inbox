import debounce from 'lodash.debounce'
import React, { useEffect, useState } from 'react'
import { isValidEnsDomain } from '../../../../utils/address'
import Avatar from '../../../account/Avatar'
import './SearchSuggestions.scss'

interface SearchSuggestionsProps {
  name: string
  onNameClick: (name: string) => void
}

const queryEnsSubgraph = debounce(async (beginsWith: string) => {
  const query = {
    query:
      '\n  query lookup($name: String!) {\n    domains(\n      first: 4\n      where: { name_starts_with: $name, resolvedAddress_not: null }\n      orderBy: labelName\n      orderDirection: asc\n    ) {\n      name\n      resolver {\n        addr {\n          id\n        }\n      }\n      owner {\n        id\n      }\n    }\n  }\n',
    variables: { name: beginsWith }
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
}, 200)

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ name, onNameClick }) => {
  const [domains, setDomains] = useState<string[]>([])

  useEffect(() => {
    if (name.length > 2) {
      queryEnsSubgraph(name)?.then(setDomains)
    } else {
      setDomains([])
    }
  }, [name, setDomains])

  const shouldDisplay = name.length > 2 && !isValidEnsDomain(name)

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
