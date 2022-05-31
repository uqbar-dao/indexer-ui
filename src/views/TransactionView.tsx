import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link from '../components/nav/Link'
import Card from '../components/card/Card'
import Container from '../components/spacing/Container'
import Row from '../components/spacing/Row'
import Text from '../components/text/Text'
import CopyIcon from '../components/card/CopyIcon'
import useExplorerStore from '../store/explorerStore'
import { RawTransaction, Transaction } from '../types/Transaction'
import { getStatus, mockData } from '../utils/constants'
import { removeDots } from '../utils/format'
import { addHexDots } from '../utils/number'
import { processRawData } from '../utils/object'
import Entry from '../components/card/Entry'
import { mockTransaction } from '../utils/mocks'

import './TransactionView.scss'

const TransactionView = () => {
  const { scry } = useExplorerStore()
  const location = useLocation()
  const [transaction, setTransaction] = useState<Transaction | undefined>()

  const splitPath = location.pathname.split('/')
  const txnHash = addHexDots(splitPath[splitPath.length - 1])

  useEffect(() => {
    const getData = async () => {
      // 0x523515b872fce8297919a3e40bfd48dec4d27d9700dd44dd81efc254ef8aa3e6
      
      const result = await scry<{ eggs: RawTransaction[] }>(`/egg/${txnHash}`)
      console.log('SCRY DATA:', result)
      setTransaction(processRawData(result.eggs[0]))
    }

    if (mockData) {
      return setTransaction(mockTransaction)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!transaction) {
    return <Text>No transaction data</Text>
  }

  const { location: loc, egg: { shell, yolk } } = transaction

  return (
    <Container className='transaction-view'>
      <Row style={{ alignItems: 'flex-end' }}>
        <h2 style={{ fontWeight: 500, margin: '16px 16px 0 0' }}>Transaction</h2>
        <CopyIcon text={removeDots(txnHash)} />
        <Text mono oneLine style={{ fontSize: 18 }}>
          {removeDots(txnHash)}
        </Text>
      </Row>
      <Card style={{ marginTop: 16, padding: '12px 16px' }}>
        <Text style={{ fontWeight: 600, margin: '-12px -16px 0', padding: '12px 16px', borderBottom: '1px solid lightgray' }}>
          Overview
        </Text>
        <Link href={`/block/${loc.epochNum}/${loc.blockNum}/${loc.townId}`} className="address">
          <Entry>
            <Text style={{ width: 80 }}>Block:</Text>
            <Text mono oneLine>{loc.epochNum}-{loc.blockNum}-{loc.townId}</Text>
          </Entry>
        </Link>
        <Link href={`/address/${removeDots(shell.from.id)}`} className="address">
          <Entry>
            <Text style={{ width: 80 }}>From:</Text>
            <Text mono oneLine>{removeDots(shell.from.id)}</Text>
          </Entry>
        </Link>
        <Entry>
          <Text style={{ width: 80 }}>To:</Text>
          <Text mono oneLine>{removeDots(shell.to)}</Text>
        </Entry>
        <Entry>
          <Text style={{ width: 80 }}>Status:</Text>
          <Text mono>{getStatus(shell.status)}</Text>
        </Entry>
        <Entry>
          <Text style={{ width: 80 }}>Budget:</Text>
          <Text mono oneLine>{shell.budget}</Text>
        </Entry>
        <Link href={`/address/${removeDots(yolk.caller.id)}`} className="address">
          <Entry>
            <Text style={{ width: 80 }}>Caller:</Text>
            <Text mono oneLine>{removeDots(yolk.caller.id)}</Text>
          </Entry>
        </Link>
        <Entry>
          <Text style={{ width: 80 }}>Args:</Text>
          <Text mono oneLine>{removeDots(JSON.stringify(yolk.args))}</Text>
        </Entry>
        <Row style={{ padding: '12px 0 2px' }}>
          <Text style={{ width: 80 }}>Grains:</Text>
          <Text mono oneLine>{removeDots((yolk.myGrains.length ? yolk.myGrains : yolk.contGrains).join(', '))}</Text>
        </Row>
      </Card>
    </Container>
  )
}

export default TransactionView
