import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link from '../components/nav/Link'
import Card from '../components/card/Card'
import Col from '../components/spacing/Col'
import Container from '../components/spacing/Container'
import Row from '../components/spacing/Row'
import Text from '../components/text/Text'
import CopyIcon from '../components/card/CopyIcon'
import useExplorerStore from '../store/explorerStore'
import { Transaction, RawTransaction } from '../types/Transaction'
import { getStatus, mockData } from '../utils/constants'
import { removeDots } from '../utils/format'
import { addHexDots } from '../utils/number'
import { processRawData } from '../utils/object'
import { mockTransactions } from '../utils/mocks'

import './AddressView.scss'

const AddressView = () => {
  const { scry } = useExplorerStore()
  const location = useLocation()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const splitPath = location.pathname.split('/')
  const address = addHexDots(splitPath[splitPath.length - 1])

  useEffect(() => {
    const getData = async () => {
      const result = await scry<{ eggs: RawTransaction[] }>(`/from/${address}`)
      console.log('SCRY DATA:', result)
      setTransactions(processRawData(result.eggs).filter(Boolean).reverse())
    }

    if (mockData) {
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <Container className='address-view'>
      <Row style={{ alignItems: 'flex-end' }}>
        <h2 style={{ fontWeight: 500, margin: '16px 16px 0 0' }}>Address</h2>
        <CopyIcon text={removeDots(address)} />
        <Text mono oneLine style={{ fontSize: 18 }}>
          {removeDots(address)}
        </Text>
      </Row>
      
      {/* TODO: add in assets */}

      <Card style={{ marginTop: 16, padding: '12px 16px' }}>
        <Text style={{ fontWeight: 600, margin: '-12px -16px 0', padding: '12px 16px', borderBottom: '1px solid lightgray' }}>
          Transactions
        </Text>
        <Col style={{ paddingTop: 12 }}>
          {transactions.map((tx, i) => (
            <Col style={{ padding: 4 }} key={i}>
              <Link href={`/tx/${removeDots('0x241a8cb84029928faf49a5c01c9a03f43538829512d4b2e383e3fd1d7b25dd2b')}`} className="transaction">
                <Text mono oneLine>{i + 1}. {removeDots('0x241a8cb84029928faf49a5c01c9a03f43538829512d4b2e383e3fd1d7b25dd2b')}</Text>
              </Link>
              <Row style={{ marginLeft: 28 }}>
                <Text style={{ width: 80 }}>Status:</Text>
                <Text mono>{getStatus(tx.egg.shell.status)}</Text>
              </Row>
            </Col>
          ))}
        </Col>
      </Card>
    </Container>
  )
}

export default AddressView
