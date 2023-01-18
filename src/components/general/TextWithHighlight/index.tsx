import React from 'react'
import './TextWithHighlight.scss'

interface TextWithHighlightProps {
  text: string
  highlightedText: string
}

const TextWithHighlight: React.FC<TextWithHighlightProps> = ({ text, highlightedText }) => {
  if (!highlightedText || !text || !text.includes(highlightedText)) {
    return <span>{text}</span>
  }

  return (
    <div className="TextWithHighlight">
      <span>{text.substring(0, text.indexOf(highlightedText))}</span>
      <span className="TextWithHighlight__highlighted">{highlightedText}</span>
      <span>{text.substring(text.indexOf(highlightedText) + highlightedText.length)}</span>
    </div>
  )
}

export default TextWithHighlight
