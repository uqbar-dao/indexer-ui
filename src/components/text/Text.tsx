import React from 'react'
import './Text.scss'

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  mono?: boolean
  oneLine?: boolean
}

const Text: React.FC<TextProps> = ({
  mono = false,
  oneLine = false,
  ...props
}) => {
  return (
    <span {...props} className={`text ${props.className || ''} ${mono ? 'mono' : ''} ${oneLine ? 'one-line' : ''}`}>
      {props.children}
    </span>
  )
}

export default Text
