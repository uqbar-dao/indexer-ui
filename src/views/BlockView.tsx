import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa'

import Card from '../components/card/Card'
import Col from '../components/spacing/Col'
import Container from '../components/spacing/Container'
import Row from '../components/spacing/Row'
import Text from '../components/text/Text'
import useExplorerStore from '../store/explorerStore'
import { Block, RawBlock } from '../types/Block'
import { removeDots } from '../utils/format'
import { addDecimalDots } from '../utils/number'
import { processRawData } from '../utils/object'
import CopyIcon from '../components/card/CopyIcon'
import Link from '../components/nav/Link'
import Entry from '../components/card/Entry'
import { mockData } from '../utils/constants'
import { mockBlock } from '../utils/mocks'

import './BlockView.scss'

const BlockView = () => {
  const { scry } = useExplorerStore()
  const location = useLocation()
  const [block, setBlock] = useState<Block | undefined>()
  const [expandTransactions, setExpandTransactions] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const params = location.pathname.split('/').slice(2)
      if (params.length < 3) {
        return
      }
      const formattedParams = params.map(addDecimalDots)
      const result = await scry<RawBlock>(`/chunk-num/${formattedParams.join('/')}`)
      console.log('CHUNKS:', result)
      setBlock(processRawData(result))
    }

    if (mockData) {
      return setBlock(mockBlock)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!block) {
    return <Text>No block data</Text>
  }

  return (
    <Container className='block-view'>
      <Row style={{ alignItems: 'flex-end' }}>
        <h2 style={{ fontWeight: 500, margin: '16px 16px 0 0' }}>Block</h2>
        <CopyIcon text={removeDots(`${block.location.epochNum}/${block.location.blockNum}/${block.location.townId}`)} />
        <Text style={{ fontSize: 18 }}>
          # {block.location.epochNum}-{block.location.blockNum}-{block.location.townId}
        </Text>
      </Row>
      <Card style={{ marginTop: 16, padding: '12px 16px' }}>
        <Text style={{ fontWeight: 600, margin: '-12px -16px 0', padding: '12px 16px', borderBottom: '1px solid lightgray' }}>
          Overview
        </Text>
        <Entry>
          <Text style={{ width: 128 }}>Granary:</Text>
          <Text>{Object.keys(block.chunk.town.granary).length}</Text>
        </Entry>
        <Entry>
          <Text style={{ width: 128 }}>Population:</Text>
          <Text>{Object.keys(block.chunk.town.populace).length}</Text>
        </Entry>
        <Entry className="transactions" onClick={() => setExpandTransactions(!expandTransactions)}>
          {expandTransactions ? <FaCaretDown /> : <FaCaretRight />}
          <Text style={{ width: 110, marginLeft: 4 }}>Transactions:</Text>
          <Text>{block.chunk.transactions.length}</Text>
        </Entry>
        {expandTransactions && (
          <Col style={{ paddingTop: 4, paddingLeft: 22 }}>
            {block.chunk.transactions.map((tx, i) => (
              <Link href={`/tx/${removeDots(tx.hash)}`} className="transaction" key={tx.hash}>
                <Text mono oneLine>{i + 1}. {removeDots(tx.hash)}</Text>
              </Link>
            ))}
          </Col>
        )}
        {/* town: {
          granary: {
            [key: string]: {
              germ: {
                data: number
                isRice: boolean
                salt: number
              }
              holder: string
              id: string
              lord: string
              townId: number
            }
          }
          populace: { [key: string]: number }
        }
        transactions: any[] */}
      </Card>
    </Container>
  )
}

export default BlockView
