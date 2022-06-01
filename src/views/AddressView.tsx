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
import { mockHolderGrains, mockTransactions } from '../utils/mocks'

import './AddressView.scss'
import { Grain, RawGrain } from '../types/Grain'
import { RawLocation } from '../types/Location'

const AddressView = () => {
  const { scry } = useExplorerStore()
  const location = useLocation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [grains, setGrains] = useState<Grain[]>([])
  const [display, setDisplay] = useState<'txns' | 'grains'>('txns')

  const splitPath = location.pathname.split('/')
  const address = addHexDots(splitPath[splitPath.length - 1])

  useEffect(() => {
    const getData = async () => {
      const [from, holder] = await Promise.all([
        scry<{ eggs: RawTransaction[] }>(`/from/${address}`),
        scry<{ grains: { [key: string]: { grain: RawGrain; location: RawLocation } } }>(`/holder/${address}`)
      ])
      console.log('FROM:', from)
      console.log('HOLDER:', holder)

      setTransactions(processRawData(from.eggs).filter(Boolean).reverse())
      setGrains(Object.values(holder.grains).map(value => processRawData(value).grain))
    }

    if (mockData) {
      setGrains(mockHolderGrains)
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  console.log(transactions)

  return (
    <Container className='address-view'>
      <Row style={{ alignItems: 'flex-end' }}>
        <h2 style={{ fontWeight: 500, margin: '16px 16px 0 0' }}>Address</h2>
        <CopyIcon text={removeDots(address)} />
        <Text mono oneLine style={{ fontSize: 18 }}>
          {removeDots(address)}
        </Text>
      </Row>
      <Card style={{ marginTop: 16, padding: '12px 16px' }}>
        <Row style={{ margin: '-12px -16px 0', borderBottom: '1px solid lightgray' }}>
          <Text onClick={() => setDisplay('txns')} className={`selector ${display === 'txns' && 'selected'}`}>
            Transactions
          </Text>
          <Text onClick={() => setDisplay('grains')} className={`selector ${display === 'grains' && 'selected'}`}>
            Assets
          </Text>
        </Row>
        <Col style={{ paddingTop: 12 }}>
          {display === 'txns' ? transactions.map((tx, i) => (
            <Col style={{ padding: 4 }} key={i}>
              <Row className="grain">
                <Text style={{ width: 28 }}>{i + 1}.</Text>
                <Text style={{ width: 80 }}>Hash:</Text>
                <Link href={`/tx/${removeDots('0x241a8cb84029928faf49a5c01c9a03f43538829512d4b2e383e3fd1d7b25dd2b')}`} className="transaction">
                  <Text mono oneLine>{removeDots('0x241a8cb84029928faf49a5c01c9a03f43538829512d4b2e383e3fd1d7b25dd2b')}</Text>
                </Link>
              </Row>
              <Row style={{ marginLeft: 28 }}>
                <Text style={{ width: 80 }}>To:</Text>
                <Text mono>{removeDots(tx.egg.shell.to)}</Text>
              </Row>
              <Row style={{ marginLeft: 28 }}>
                <Text style={{ width: 80 }}>Status:</Text>
                <Text mono>{getStatus(tx.egg.shell.status)}</Text>
              </Row>
            </Col>
          )) : grains.map((grain, i) => (
            <Col style={{ padding: 4 }} key={i}>
              <Row className="grain">
                <Text style={{ width: 28 }}>{i + 1}.</Text>
                <Text style={{ width: 80 }}>ID:</Text>
                <Text mono oneLine>{removeDots(grain.id)}</Text>
              </Row>
              <Row style={{ marginLeft: 28 }}>
                <Text style={{ width: 80 }}>Lord:</Text>
                <Link href={`/contract/${removeDots(grain.lord)}`} className="lord">
                  <Text mono>{removeDots(grain.lord)}</Text>
                </Link>
              </Row>
              <Row style={{ marginLeft: 28 }}>
                <Text style={{ width: 80 }}>Town:</Text>
                <Text mono>{grain.townId}</Text>
              </Row>
            </Col>
          ))}
        </Col>
      </Card>
    </Container>
  )
}

export default AddressView
