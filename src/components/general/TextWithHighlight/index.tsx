import React from 'react'
import './TextWithHighlight.scss'
import Text from '../Text'

interface TextWithHighlightProps {
  text: string
  highlightedText: string
}

const TextWithHighlight: React.FC<TextWithHighlightProps> = ({ text, highlightedText }) => {
  if (!highlightedText || !text || !text.includes(highlightedText)) {
    return <Text variant="paragraph-500">{text}</Text>
  }

  const preHighlighted = text.substring(0, text.indexOf(highlightedText))
  const postHighlighted = text.substring(text.indexOf(highlightedText) + highlightedText.length)

  return (
    <div className="TextWithHighlight">
      <span>{preHighlighted}</span>
      <span className="TextWithHighlight__highlighted">{highlightedText}</span>
      <span>{postHighlighted}</span>
    </div>
  )
}

export default TextWithHighlight
