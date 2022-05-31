import React from 'react'
import Row from '../spacing/Row';
import './Entry.scss'

interface EntryProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Entry: React.FC<EntryProps> = ({ className = '', children, ...rest }) => {
  return (
    <Row className={`entry ${className}`} {...rest}>
      {children}
    </Row>
  )
}

export default Entry
