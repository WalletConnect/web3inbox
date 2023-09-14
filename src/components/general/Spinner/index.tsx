import React from 'react'
import './Spinner.scss'

interface SpinnerProps {
  width: string
}

const Spinner: React.FC<SpinnerProps> = ({ width }) => {
  return (
    <svg className="Spinner" viewBox="25 25 50 50" style={{ width, height: width }}>
      <circle r="20" cy="50" cx="50"></circle>
    </svg>
  )
}

export default Spinner
