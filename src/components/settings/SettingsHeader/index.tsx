import React, { Fragment } from 'react'

import Text from '@/components/general/Text'

import './SettingsHeader.scss'

const SettingsHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Fragment>
      <div className="SettingsHeader__border"></div>
      <div className="SettingsHeader">
        <Text className="SettingsHeader__title" variant="large-600">
          {title}
        </Text>
      </div>
    </Fragment>
  )
}

export default SettingsHeader
