import { GetState, SetState } from "zustand";
import { IncomingBlock, RawIncomingBlock } from "../../types/IncomingBlock";
import { HashTransaction } from "../../types/Transaction";
import { processRawData } from "../../utils/object";
import { ExplorerStore } from "../explorerStore";

export const handleLatestBlock = (get: GetState<ExplorerStore>, set: SetState<ExplorerStore>) => async (blockHeader: RawIncomingBlock) => {
  const ib: IncomingBlock = processRawData(blockHeader)

  if (ib.slot.block.height > get().blockHeaders[0].epochNum) {
    const cur = get()
  
    const blockHeaders = [{ epochNum: ib.slot.block.height, blockHeader: ib.slot.header }, ...cur.blockHeaders.slice(0, 4)]
    const transactions = Object.values(ib.slot.block.chunks).reduce((acc: HashTransaction[], cur) => acc.concat(cur.transactions), [])
  
    set({ blockHeaders, transactions })
  }
}
