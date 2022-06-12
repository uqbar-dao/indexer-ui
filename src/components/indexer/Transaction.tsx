import moment from 'moment'
import { Transaction } from "../../types/Transaction"
import { getStatus } from "../../utils/constants"
import { removeDots } from "../../utils/format"
import Link from "../nav/Link"
import Col from "../spacing/Col"
import Row from "../spacing/Row"
import Text from "../text/Text"
import './Transaction.scss'

interface TransactionProps {
  tx: Transaction
  displayIndex: number
  isWalletAddress?: boolean
}

export const TransactionEntry = ({
  tx,
  displayIndex,
  isWalletAddress = false,
}: TransactionProps) => {
  return (
    <Row className="transaction" style={{ padding: 4, alignItems: 'flex-start' }}>
      <Col>
        <Text style={{ width: 28 }}>{displayIndex}.</Text>
      </Col>
      <Col style={{ maxWidth: 'calc(100% - 20px)' }}>
        <Row>
          <Text style={{ minWidth: 60 }}>Time:</Text>
          <Text mono oneLine>{moment(tx.timestamp).format('YYYY-MM-DD hh:mm')}</Text>
        </Row>
        <Row>
          <Text style={{ minWidth: 60 }}>Hash:</Text>
          <Link href={`/tx/${removeDots(tx.hash || '')}`}>
            <Text mono oneLine>{removeDots(tx.hash || '')}</Text>
          </Link>
        </Row>
        <Row>
        {isWalletAddress ? (
            <>
              <Text style={{ minWidth: 60 }}>To:</Text>
              <Link href={`/grain/${removeDots(tx.egg.shell.to)}`}>
                <Text mono oneLine>{removeDots(tx.egg.shell.to)}</Text>
              </Link>
            </>
          ) : (
            <>
              <Text style={{ minWidth: 60 }}>From:</Text>
              <Link href={`/grain/${removeDots(tx.egg.shell.from.id)}`}>
                <Text mono oneLine>{removeDots(tx.egg.shell.from.id)}</Text>
              </Link>
            </>
          )}
        </Row>
        <Row>
          <Text style={{ minWidth: 60 }}>Status:</Text>
          <Text mono oneLine>{getStatus(tx.egg.shell.status)}</Text>
        </Row>
      </Col>
    </Row>
  )
}
