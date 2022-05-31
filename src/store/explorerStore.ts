import { SubscriptionRequestInterface } from "@urbit/http-api"
import create from "zustand"
import api from "../api"
import { handleLatestBlock } from "./subscriptions/explorer"
import { BlockHeader, RawBlockHeader } from '../types/BlockHeader'
import { processRawData } from '../utils/object'
import { addDecimalDots } from '../utils/number'
import { HashTransaction } from '../types/Transaction'
import { Block, RawBlock } from '../types/Block'

export function createSubscription(app: string, path: string, e: (data: any) => void): SubscriptionRequestInterface {
  const request = {
    app,
    path,
    event: e,
    err: () => console.warn('SUBSCRIPTION ERROR'),
    quit: () => {
      throw new Error('subscription clogged')
    }
  }
  // TODO: err, quit handling (resubscribe?)
  return request
}

export interface ExplorerStore {
  loadingText: string | null
  requestCache: { [key: string] : any }
  blockHeaders: BlockHeader[]
  transactions: HashTransaction[]
  init: () => Promise<void>
  scry: <T>(path: string) => Promise<T>
  setLoading: (loadingText: string | null) => void
  getBlockHeaders: (numHeaders: number) => Promise<void>
  getChunkInfo: (epoch: number, block: number, town: number) => Promise<void>
  getTransactionInfo: (transaction: string) => Promise<void>
  getAddressInfo: (address: string) => Promise<void>
}

const useExplorerStore = create<ExplorerStore>((set, get) => ({
  loadingText: 'Loading...',
  requestCache: {},
  blockHeaders: [],
  transactions: [],
  init: async () => {
    // Subscriptions, includes getting assets
    api.subscribe(createSubscription('uqbar-indexer', '/slot', handleLatestBlock(get, set)))

    const { headers } = await get().scry<{ headers: RawBlockHeader[] }>('/headers/5')
    const blockHeaders = headers.map(processRawData)
    set({ blockHeaders })

    const rawBlocks = await Promise.all(blockHeaders.map((bh: BlockHeader) => 
      get().scry<RawBlock>(`/chunk-num/${addDecimalDots(bh.epochNum.toString())}/${bh.blockHeader.num}/${0}`)
    ))
    const blocks: Block[] = rawBlocks.map(processRawData)
    const transactions = blocks
      .reduce((acc: HashTransaction[], cur) => acc.concat(cur.chunk.transactions), [])
      .slice(0, 10)

    set({ loadingText: null, transactions })
  },
  scry: async <T>(path: string) => {
    const { requestCache } = get()
    const cachedResponse = requestCache[path];

    if (cachedResponse) {
      return cachedResponse
    }


    const result = api.scry<T>({ app: 'uqbar-indexer', path })
    requestCache[path] = result
    set({ requestCache })
    return result
  },
  setLoading: (loadingText: string | null) => set({ loadingText }),
  getBlockHeaders: async (numHeaders: number) => {
    const blockHeaders = await api.scry({app: "uqbar-indexer", path: `/headers/${numHeaders}`})
    console.log('BLOCK HEADERS:', blockHeaders)
  },
  getChunkInfo: async (epoch: number, block: number, town: number) => {
    const chunks = await api.scry({app: "uqbar-indexer", path: `/chunk-num/${epoch}/${block}/${town}`})
    console.log('CHUNKS:', chunks)
  },
  getTransactionInfo: async (transaction: string) => {
    await api.scry({app: "uqbar-indexer", path: `/egg/${transaction}`})
  },
  getAddressInfo: async (address: string) => {
    await api.scry({app: "uqbar-indexer", path: `/from/${address}`})
  },
}))

export default useExplorerStore
