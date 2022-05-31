import { HashTransaction } from "./Transaction"

export interface RawGranary {
  [key: string]: {
    germ: {
      'data': number
      'is-rice': boolean
      'salt': number
    }
    'holder': string
    'id': string
    'lord': string
    'town-id': number
  }
}

export interface Granary {
  [key: string]: {
    germ: {
      isRice: boolean
      cont?: null
      owns?: string[]
      data?: number
      salt?: number
    }
    holder: string
    id: string
    lord: string
    townId: number
  }
}

export interface Populace { [key: string]: number }

export interface RawBlock {
  chunk: {
    town: {
      granary: RawGranary
      populace: Populace
    }
    transactions: any[]
  }
  location: {
    'block-num': number
    'epoch-num': number
    'town-id': number
  }
}

export interface Block {
  chunk: {
    town: {
      granary: Granary
      populace: Populace
    }
    transactions: HashTransaction[]
  }
  location: {
    blockNum: number
    epochNum: number
    townId: number
  }
}
