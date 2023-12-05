import React, { useContext } from 'react'

import type { ActionMeta, MultiValue, SingleValue } from 'react-select'
import ReactSelect from 'react-select'

import SettingsContext from '@/contexts/SettingsContext/context'
import { useColorModeValue } from '@/utils/hooks'

import DropdownIndicator from './DropdownIndicator'

import './Select.scss'

interface ISelectProps {
  name: string
  id: string
  options: {
    label: string
    value: string
  }[]
  onChange:
    | ((
        newValue:
          | MultiValue<{
              label: string
              value: string
            }>
          | SingleValue<{
              label: string
              value: string
            }>,
        actionMeta: ActionMeta<{
          label: string
          value: string
        }>
      ) => void)
    | undefined
}

const Select: React.FC<ISelectProps> = ({ name, id, options, onChange }) => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  return (
    <ReactSelect
      classNamePrefix="Select"
      name={name}
      id={id}
      onChange={onChange}
      isSearchable={false}
      defaultValue={options[0]}
      styles={{
        control: baseStyles => ({
          ...baseStyles,
          cursor: 'pointer',
          boxShadow: 'none'
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isSelected
            ? themeColors['--accent-color-1']
            : themeColors['--bg-color-2'],
          color: state.isSelected ? 'white' : themeColors['--fg-color-1'],
          cursor: 'pointer',
          transition: '250ms all ease-in-out',
          ':hover': {
            backgroundColor: state.isSelected ? themeColors['--accent-color-1'] : '#D9DBDB'
          }
        })
      }}
      components={{
        DropdownIndicator,
        IndicatorSeparator: () => null
      }}
      options={options}
    />
  )
}

export default Select
