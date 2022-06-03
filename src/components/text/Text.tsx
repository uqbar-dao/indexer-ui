import React from 'react'
import './Text.scss'

interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  mono?: boolean
  oneLine?: boolean
  large?: boolean
}

const Text: React.FC<TextProps> = ({
  mono = false,
  oneLine = false,
  large = false,
  ...props
}) => {
  return (
    <div {...props} className={`text ${props.className || ''} ${mono ? 'mono' : ''} ${oneLine ? 'one-line' : ''} ${large ? 'large' : ''}`}>
      {props.children}
    </div>
  )
}

export default Text
