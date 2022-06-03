import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../components/card/Card'
import Col from '../components/spacing/Col'
import Container from '../components/spacing/Container'
import Row from '../components/spacing/Row'
import Text from '../components/text/Text'
import CopyIcon from '../components/card/CopyIcon'
import useExplorerStore from '../store/explorerStore'
import { Transaction } from '../types/Transaction'
import { mockData } from '../utils/constants'
import { removeDots } from '../utils/format'
import { addHexDots } from '../utils/number'
import { processRawData } from '../utils/object'
import { mockHolderGrains, mockTransactions } from '../utils/mocks'

import './AddressView.scss'
import { Grain, RawGrain } from '../types/Grain'
import { RawLocation } from '../types/Location'
import { HashData, RawHashData } from '../types/HashData'
import { ADDRESS_REGEX, ETH_ADDRESS_REGEX } from '../utils/regex'
import { TransactionEntry } from '../components/indexer/Transaction'
import { GrainEntry } from '../components/indexer/Grain'

type Selection = 'txns' | 'grains'

const AddressView = () => {
  const { scry } = useExplorerStore()
  const location = useLocation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [grains, setGrains] = useState<Grain[]>([])
  const [display, setDisplay] = useState<Selection>('txns')
  const [grainIsRice, setGrainIsRice] = useState(false)
  const [town, setTown] = useState(-1)

  const splitPath = location.pathname.split('/')
  const address = addHexDots(splitPath[splitPath.length - 1])
  const isWalletAddress = ADDRESS_REGEX.test(removeDots(address)) || ETH_ADDRESS_REGEX.test(removeDots(address))

  useEffect(() => {
    const getData = async () => {
      try {
        const [rawData, rawGrains, grainInfo] = await Promise.all([
          scry<RawHashData>(`/hash/${address}`),
          scry<{ grain: { [key: string]: { grain: RawGrain; location: RawLocation } } }>(`/holder/${address}`),
          scry<{ grain: { [key: string]: { grain: RawGrain; location: RawLocation } } }>(`/grain/${address}`)
        ])
        
        const grainIsRice = Boolean(
          Object.values(grainInfo?.grain || {}).length === 1 &&
          Object.values(grainInfo?.grain || {})[0]?.grain?.germ?.['is-rice']
        )
        setGrainIsRice(grainIsRice)
        if (grainIsRice && !isWalletAddress) {
          setDisplay('grains')
        }

        const newGrains = Object.values(rawGrains?.grain || grainInfo?.grain || {})
          .map((value) => processRawData(value).grain)
          // .reduce((acc: { [key: number]: Grain[] }, cur) => {
          //   const grain: Grain = processRawData(cur).grain
          //   console.log(grain.id, grain.townId)
          //   if (acc[grain.townId]) {
          //     console.log(1)
          //     acc[grain.townId].push(grain)
          //   } else {
          //     console.log(2)
          //     acc[grain.townId] = [grain]
          //   }
          //   console.log(3, acc)
          //   return acc
          // }, {})
        setGrains(newGrains)

        if (rawData) {
          const { hash }: HashData = processRawData(rawData)
          const txns = Object.keys(hash.eggs).map(txnHash => ({ ...hash.eggs[txnHash], hash: txnHash }))
          setTransactions(txns)
        }
      } catch (err) {}
    }

    if (mockData) {
      setGrains(mockHolderGrains)
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  const isRice = !isWalletAddress && grainIsRice

  const towns: number[] = (display === 'txns' ? transactions.reduce((acc: number[], cur: Grain | Transaction) => {
    if ('germ' in cur) {
      if (!acc.includes(cur.townId)) {
        acc.push(cur.townId)
      }
    } else {
      if (!acc.includes(cur.location.townId)) {
        acc.push(cur.location.townId)
      }
    }
    return acc
  }, []) : grains.reduce((acc: number[], cur: Grain | Transaction) => {
    if ('germ' in cur) {
      if (!acc.includes(cur.townId)) {
        acc.push(cur.townId)
      }
    } else {
      if (!acc.includes(cur.location.townId)) {
        acc.push(cur.location.townId)
      }
    }
    return acc
  }, []))

  const displayTransactions = town < 0 ? transactions : transactions.filter(tx => tx.location.townId === town)
  const displayGrains = town < 0 ? grains : grains.filter(gr => gr.townId === town)

  return (
    <Container className='address-view'>
      <Row style={{ alignItems: 'flex-end' }}>
        <h2 style={{ fontWeight: 500, margin: '16px 16px 0 0' }}>
          {isWalletAddress ? 'Address' : grainIsRice ? 'Asset' : 'Contract'}
        </h2>
        <CopyIcon text={removeDots(address)} />
        <Text mono oneLine style={{ fontSize: 18 }}>
          {removeDots(address)}
        </Text>
      </Row>
      <Card style={{ marginTop: 16, padding: '12px 16px' }}>
        {!isRice && (
          <Row style={{ margin: '-12px -16px 0', borderBottom: '1px solid lightgray', justifyContent: 'space-between' }}>
            <Row>
              <Text large onClick={() => setDisplay('txns')} className={`selector ${display === 'txns' && 'selected'}`}>
                Transactions
              </Text>
              <Text large onClick={() => setDisplay('grains')} className={`selector ${display === 'grains' && 'selected'}`}>
                Assets
              </Text>
            </Row>
            <Row style={{ padding: '12px 16px' }}>
              <Text style={{ marginRight: 12 }}>Town:</Text>
              <select value={town} style={{ padding: '2px 4px', fontSize: 14 }} onChange={(e) => setTown(Number(e.target.value))}>
                <option value={-1} key={-1}>All</option>
                {towns.map(t => <option value={t} key={t}>{t}</option>)}
              </select>
            </Row>
          </Row>
        )}
        <Col style={{ paddingTop: 12 }}>
          {display === 'txns' ? (
            displayTransactions.length > 0 ? (
              displayTransactions.map((tx, i, arr) => (
                <TransactionEntry tx={tx} isWalletAddress={isWalletAddress} displayIndex={arr.length - i} key={tx.hash || i} />
              ))
            ) : (
              <Text>No transactions under this town(s)</Text>
            )
          ) : (
            displayGrains.length > 0 ? (
              displayGrains.map((grain) => (
                <GrainEntry grain={grain} isRice={isRice} isWalletAddress={isWalletAddress} key={grain.id} />
              ))
            ) : (
              <Text style={{ padding: 16 }}>No assets under this town(s)</Text>
            )
          )}
        </Col>
      </Card>
    </Container>
  )
}

export default AddressView
