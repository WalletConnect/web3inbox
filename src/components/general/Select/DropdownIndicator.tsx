import { useContext, useMemo } from 'react'

import type { DropdownIndicatorProps } from 'react-select'
import { components } from 'react-select'

import ChevronDarkIcon from '@/assets/ChevronDark.svg'
import ChevronLightIcon from '@/assets/ChevronLight.svg'
import SettingsContext from '@/contexts/SettingsContext/context'

const DropdownIndicator = (props: DropdownIndicatorProps<{ label: string; value: string }>) => {
  const { mode } = useContext(SettingsContext)
  const chevronImg = useMemo(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const specifiedMode = mode === 'system' ? systemTheme : mode

    return specifiedMode === 'dark' ? ChevronLightIcon : ChevronDarkIcon
  }, [mode])

  return (
    <components.DropdownIndicator {...props}>
      <img src={chevronImg} alt="chevron down" />
    </components.DropdownIndicator>
  )
}

export default DropdownIndicator
