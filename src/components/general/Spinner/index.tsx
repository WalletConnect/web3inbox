import React from 'react'
import SpinnerImage from '../../../assets/Spinner.png'
import './Spinner.scss'

interface SpinnerProps {
  width: string
}

const Spinner: React.FC<SpinnerProps> = ({ width }) => {
  return (
    <div className="Spinner" style={{ width, height: width }}>
      <div className="Spinner__inner">
        <img src={SpinnerImage} style={{ width, height: width }} alt="Spinner" />
      </div>
    </div>
  )
}

export default Spinner
