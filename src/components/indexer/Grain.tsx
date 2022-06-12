import useExplorerStore from "../../store/explorerStore"
import { Grain } from "../../types/Grain"
import { removeDots } from "../../utils/format"
import Link from "../nav/Link"
import Col from "../spacing/Col"
import Row from "../spacing/Row"
import Text from "../text/Text"
import './Grain.scss'

interface GrainEntryProps {
  grain: Grain
  isRiceView?: boolean
  isWalletAddress?: boolean
}

export const GrainEntry = ({
  grain,
  isRiceView = false,
  isWalletAddress = false,
}: GrainEntryProps) => {
  const { metadata } = useExplorerStore()
  const tokenMetadata = grain.germ.salt ? metadata[grain.germ.salt] : null

  return (
    grain.id !== grain.lord ? (
      <Col className="grain" key={grain.id}>
        <Row className="id">
          <Text style={{ minWidth: 60 }}>ID:</Text>
          <Link href={`/grain/${removeDots(grain.id)}`}>
            <Text mono oneLine>{removeDots(grain.id)}</Text>
          </Link>
        </Row>
        <Row>
          {isWalletAddress ? (
            <>
              <Text style={{ minWidth: 60 }}>Lord:</Text>
              <Link href={`/grain/${removeDots(grain.lord)}`}>
                <Text mono oneLine>{removeDots(grain.lord)}</Text>
              </Link>
            </>
          ) : (
            grain.holder !== grain.lord && (
              <>
                <Text style={{ minWidth: 60 }}>Holder:</Text>
                <Link href={`/address/${removeDots(grain.holder)}`}>
                  <Text mono oneLine>{removeDots(grain.holder)}</Text>
                </Link>
              </>
            )
          )}
        </Row>
        {isRiceView && (
          <Row>
            <Text style={{ minWidth: 60 }}>Lord:</Text>
            <Link href={`/grain/${removeDots(grain.lord)}`}>
              <Text mono oneLine>{removeDots(grain.lord)}</Text>
            </Link>
          </Row>
        )}
        {Boolean(tokenMetadata) && (
          <Row>
            <Text style={{ minWidth: 60 }}>Token:</Text>
            <Text mono oneLine>{tokenMetadata?.symbol}</Text>
          </Row>
        )}
        <Row>
          <Text style={{ minWidth: 60 }}>Town:</Text>
          <Text mono oneLine>{grain.townId}</Text>
        </Row>
      </Col>
    ) : (
      <>
        {grain.germ.owns?.map((id) => (
          <Col className="grain" key={id}>
            <Row className="id">
              <Text style={{ minWidth: 60 }}>ID:</Text>
              <Link href={`/grain/${removeDots(id)}`}>
                <Text mono oneLine>{removeDots(id)}</Text>
              </Link>
            </Row>
            {/* <Row style={{ marginLeft: 28 }}>
              <Text style={{ minWidth: 60 }}>Lord:</Text>
              <Link href={`/grain/${removeDots(grain.lord)}`} className="lord">
                <Text mono oneLine>{removeDots(grain.lord)}</Text>
              </Link>
            </Row> */}
            {Boolean(tokenMetadata) && (
              <Row>
                <Text style={{ minWidth: 60 }}>Token:</Text>
                <Text mono oneLine>{tokenMetadata?.symbol}</Text>
              </Row>
            )}
            <Row>
              <Text style={{ minWidth: 60 }}>Town:</Text>
              <Text mono oneLine>{grain.townId}</Text>
            </Row>
          </Col>
        ))}
      </>
    )
  )
}
