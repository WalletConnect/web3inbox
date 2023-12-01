import React, { useContext } from 'react'

import SettingsContext from '@/contexts/SettingsContext/context'
import { useColorModeValue } from '@/utils/hooks'

const TrashIcon: React.FC = () => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.45004 2.6C4.96932 2.21053 5.60092 2 6.25003 2H7.75004C8.39915 2 9.03075 2.21053 9.55004 2.6C10.329 3.1842 11.2764 3.5 12.25 3.5H13.25C13.6642 3.5 14 3.16421 14 2.75C14 2.33579 13.6642 2 13.25 2H12.25C11.6009 2 10.9693 1.78947 10.45 1.4C9.6711 0.8158 8.7237 0.5 7.75004 0.5H6.25003C5.27637 0.5 4.32897 0.8158 3.55003 1.4C3.03075 1.78947 2.39915 2 1.75004 2H0.75C0.335786 2 0 2.33579 0 2.75C0 3.16421 0.335786 3.5 0.75 3.5H1.75004C2.7237 3.5 3.6711 3.1842 4.45004 2.6Z"
        fill={themeColors['--icon-color-1']}
      />
      <path
        d="M2.75 4.5C2.33579 4.5 2 4.83579 2 5.25V13.5C2 15.1569 3.34315 16.5 5 16.5H9C10.6569 16.5 12 15.1569 12 13.5V5.25C12 4.83579 11.6642 4.5 11.25 4.5C10.8358 4.5 10.5 4.83579 10.5 5.25V13.5C10.5 14.3284 9.82843 15 9 15H5C4.17157 15 3.5 14.3284 3.5 13.5L3.5 5.25C3.5 4.83579 3.16421 4.5 2.75 4.5Z"
        fill={themeColors['--icon-color-1']}
      />
      <path
        d="M5.5 4.5C5.91421 4.5 6.25 4.83579 6.25 5.25V12H7.75V5.25C7.75 4.83579 8.08579 4.5 8.5 4.5C8.91421 4.5 9.25 4.83579 9.25 5.25V12.75C9.25 13.1642 8.91421 13.5 8.5 13.5H5.5C5.08579 13.5 4.75 13.1642 4.75 12.75V5.25C4.75 4.83579 5.08579 4.5 5.5 4.5Z"
        fill={themeColors['--icon-color-1']}
      />
    </svg>
  )
}

export default TrashIcon
