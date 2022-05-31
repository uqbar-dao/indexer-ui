import React from 'react'
import './Card.scss'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {

}

const Card: React.FC<CardProps> = (props) => {
  return (
    <div {...props} className={`card ${props.className || ''}`}>
      {props.children}
    </div>
  )
}

export default Card
