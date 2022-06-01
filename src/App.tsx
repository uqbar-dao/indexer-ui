import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useExplorerStore from './store/explorerStore';
import HomeView from './views/HomeView';
import BlocksView from './views/BlocksView';
import BlockView from './views/BlockView';
import TransactionView from './views/TransactionView';
import AddressView from './views/AddressView';
import Navbar from './components/nav/Navbar';
import LoadingOverlay from './components/popups/LoadingOverlay';
import WheatView from './views/WheatView';
// import TransactionsView from './views/TransactionsView';
// import PendingTransactionsView from './views/PendingTransactionsView';
// import ContractsView from './views/ContractsView';
// import AccountsView from './views/AccountsView';

function App() {
  const { init, loadingText } = useExplorerStore()

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="latest-blocks/:numBlocks" element={<BlocksView />} />
        <Route path="block/:epoch/:block/:town" element={<BlockView />} />
        <Route path="tx/:tx" element={<TransactionView />} />
        <Route path="address/:address" element={<AddressView />} />
        <Route path="contract/:contract" element={<WheatView />} />
        {/* <Route path="blocks" element={<BlocksView />} />
        <Route path="txs" element={<TransactionsView />} />
        <Route path="pendingTxs" element={<PendingTransactionsView />} />
        <Route path="contracts" element={<ContractsView />} /> */}
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
      <LoadingOverlay loading={Boolean(loadingText)} text={loadingText || ''} />
    </BrowserRouter>
  );
}

export default App;
