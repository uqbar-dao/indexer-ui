import { Populace, RawGranary } from "./Block"
import { HashTransaction, RawHashTransaction } from "./Transaction"

export interface RawIncomingBlock {
  slot: {
    header: {
      'data-hash': string,
      'prev-header-hash': string,
      num: number
    }
  },
  block: {
    height: number,
    signature: {
      life: number,
      ship: string,
      hash: string
    },
    chunks: {
      [key: number]: {
        transactions: RawHashTransaction[]
        town: {
          granary: RawGranary,
          populace: Populace
        }
      }
    }
  }
}

export interface IncomingBlock {
  slot: {
    header: {
      dataHash: string,
      prevHeaderHash: string,
      num: number
    }
    block: {
      height: number,
      signature: {
        life: number,
        ship: string,
        hash: string
      },
      chunks: {
        [key: number]: {
          transactions: HashTransaction[]
          town: {
            granary: RawGranary,
            populace: Populace
          }
        }
      }
    }
  }
}
