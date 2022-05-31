import { Location, RawLocation } from "./Location"

export interface RawShell {
  budget: number
  'eth-hash': string | null
  from: {
    id: string
    nonce: number
    zigs: number
  }
  sig: {
    hash: string
    life: number
    ship: string
  }
  status: number
  to: string
  'town-id': number
}

export interface RawYolk {
  args: null | string
  caller: {
    id: string
    nonce: number
    zigs: number
  }
  'cont-grains': string[]
  'my-grains': string[]
}

export interface Shell {
  budget: number
  rate: number
  ethHash: string | null
  from: {
    id: string
    nonce: number
    zigs: number
  }
  sig: {
    hash: string
    life: number
    ship: string
  }
  status: number
  to: string
  townId: number
}

export interface Yolk {
  args: null | string
  caller: {
    id: string
    nonce: number
    zigs: number
  }
  contGrains: string[]
  myGrains: string[]
}

export interface RawHashTransaction {
  egg: {
    yolk: RawYolk
    shell: RawShell
  }
  hash: string
}

export interface HashTransaction {
  egg: {
    yolk: Yolk
    shell: Shell
  }
  hash: string
}

export interface RawTransaction {
  egg: {
    yolk: RawYolk
    shell: RawShell
  }
  location: RawLocation
}

export interface Transaction {
  egg: {
    yolk: Yolk
    shell: Shell
  }
  location: Location
}
