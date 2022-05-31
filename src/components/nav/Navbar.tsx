import React from 'react'
import { FaWallet, FaKey, FaHistory } from 'react-icons/fa'
import Row from '../spacing/Row'
import Link from './Link'
// import logoWithText from '../../assets/img/uqbar-logo-text.png'
import logo from '../../assets/img/uqbar-logo-text.png'
import './Navbar.scss'
import { isMobileCheck } from '../../utils/dimensions'
import Input from '../form/Input'

const Navbar = () => {
  const isMobile = isMobileCheck()

  return (
    <Row className='navbar'>
      <Row style={{ width: '100%', justifyContent: 'space-between' }}>
        <Link className={'nav-link logo'} href="/">
          <img src={logo} alt="Uqbar Logo" />
        </Link>
        <Row>
          <Link className={`nav-link ${window.location.pathname === `${process.env.PUBLIC_URL}/` || window.location.pathname === process.env.PUBLIC_URL ? 'selected' : ''}`} href="/">
            Home
          </Link>
        </Row>
      </Row>
    </Row>
  )
}

export default Navbar
