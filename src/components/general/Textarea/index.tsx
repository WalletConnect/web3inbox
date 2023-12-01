import React, { useEffect, useRef, useState } from 'react'

import './Textarea.scss'

interface ITextareaProps {
  placeholder?: string
  icon?: string
  value?: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea: React.FC<ITextareaProps> = ({ onChange, value, icon, placeholder }) => {
  const [inputHeight, setInputHeight] = useState(30)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      setInputHeight(textareaRef.current.scrollHeight)
    }
    if (!value?.length) {
      setInputHeight(30)
    }
  }, [value])

  return (
    <div className="Textarea">
      {icon && <img src={icon} alt="Textarea Icon" />}
      <textarea
        ref={textareaRef}
        value={value}
        className="Textarea__textarea"
        onChange={onChange}
        placeholder={placeholder}
        style={{ height: `${inputHeight}px`, maxHeight: '6em' }}
      />
    </div>
  )
}

export default Textarea
