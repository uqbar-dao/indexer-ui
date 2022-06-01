import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import Button from '../components/form/Button'
import Input from '../components/form/Input'
import Col from '../components/spacing/Col'
import Row from '../components/spacing/Row'

import './HomeView.scss'
import Container from '../components/spacing/Container'
import Card from '../components/card/Card'
import useExplorerStore from '../store/explorerStore'
import Text from '../components/text/Text'
import { ADDRESS_REGEX, BLOCK_SEARCH_REGEX, TXN_HASH_REGEX, WHEAT_REGEX, RICE_REGEX } from '../utils/regex'
import { addHexPrefix, removeDots } from '../utils/format'
import { getStatus } from '../utils/constants'
import Link from '../components/nav/Link'

const HomeView = () => {
  const { blockHeaders, transactions, init } = useExplorerStore()
  const [searchValue, setSearchValue] = useState('')
  const [inputError, setInputError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const search = () => {
    if (!searchValue) {
      setInputError('Please enter a search')
    // check for block
    } else if (BLOCK_SEARCH_REGEX.test(searchValue)) {
      console.log('BLOCK')
      navigate(`/block/${searchValue}`)
    } else if (ADDRESS_REGEX.test(addHexPrefix(removeDots(searchValue)))) {
      console.log('ADDRESS')
      navigate(`/address/${addHexPrefix(removeDots(searchValue))}`)
    // check for txn hash
    } else if (TXN_HASH_REGEX.test(addHexPrefix(removeDots(searchValue)))) {
      console.log('TRANSACTION')
      navigate(`/tx/${addHexPrefix(removeDots(searchValue))}`)
    } else if (WHEAT_REGEX.test(addHexPrefix(removeDots(searchValue)))) {
      console.log('CONTRACT')
      navigate(`/contract/${addHexPrefix(removeDots(searchValue))}`)
    } else {
      setInputError('Must be in address, txn hash, or epoch/block/town format (with slashes)')
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputError) {
      setInputError('')
    }
    setSearchValue(e.target.value)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      search()
    }
  }

  return (
    <Container className="home">
      <Col className='splash'>
        <h3>The Uqbar Blockchain Explorer</h3>
        <Row className="search">
          <Input
            value={searchValue}
            className="search-input"
            containerStyle={{ width: '80%' }}
            placeholder='Address, Txn Hash, Epoch / Block / Town'
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <Button className="search-button" onClick={search}>
            <FaSearch />
          </Button>
        </Row>
        {Boolean(inputError) && (
          <Text style={{ padding: 4, color: 'red' }}>{inputError}</Text>
        )}
      </Col>
      <Col className="info">
        {/* <Card className='highlights'>
          <Row>
            
          </Row>
        </Card> */}
        <Row className='latest'>
          <Card className='latest-blocks'>
            <h4>Latest Blocks</h4>
            <Col>
              {blockHeaders.map((bh, index) => (
                <Link href={`/block/${bh.epochNum}/${bh.blockHeader.num}/1`} style={{ textDecoration: 'none', color: 'black' }} key={bh.epochNum}>
                  <Col
                    // Town is hardcoded here
                    style={{ margin: '0 12px 12px', padding: '12px 0 0', borderTop: index === 0 ? undefined : '1px solid lightgray' }}
                  >
                    <Row>
                      <Text style={{ width: 60 }}>Epoch:</Text>
                      <Text>{bh.epochNum}</Text>
                    </Row>
                    <Row>
                      <Text style={{ width: 60 }}>Block:</Text>
                      <Text>{bh.blockHeader.num}</Text>
                    </Row>
                    <Row>
                      <Text style={{ width: 60 }}>Hash:</Text>
                      <Text mono oneLine>{removeDots(bh.blockHeader.dataHash)}</Text>
                    </Row>
                  </Col>
                </Link>
              ))}
            </Col>
          </Card>
          <Card className='latest-transactions'>
            <h4>Latest Transactions</h4>
            <Col>
              {transactions.length < 1 && (
                <Text style={{ padding: '8px 16px' }}>There are no transactions in these blocks</Text>
              )}
              {transactions.map((tx, index) => (
                <Link href={`/tx/${addHexPrefix(removeDots(tx.hash))}`} style={{ textDecoration: 'none', color: 'black' }} key={tx.hash}>
                  <Col style={{ margin: '0 12px 12px', padding: '12px 0 0', borderTop: index === 0 ? undefined : '1px solid lightgray' }}>
                    <Row>
                      <Text style={{ width: 60 }}>Hash:</Text>
                      <Text mono oneLine>{removeDots(tx.hash)}</Text>
                    </Row>
                    <Row>
                      <Text style={{ width: 60 }}>From:</Text>
                      <Text mono oneLine>{tx.egg.shell.from}</Text>
                    </Row>
                    <Row>
                      <Text style={{ width: 60 }}>Status:</Text>
                      <Text>{getStatus(tx.egg.shell.status)}</Text>
                    </Row>
                  </Col>
                </Link>
              ))}
            </Col>
          </Card>
        </Row>
      </Col>
    </Container>
  )
}

export default HomeView
