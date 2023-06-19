import Wallet from "./Wallet";
import Tx from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("")
  const [walletError, setWalletError] = useState("")
  const [nonce, setNonce] = useState(0)

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
        walletError={walletError}
        setWalletError={setWalletError}
        nonce={nonce}
        setNonce={setNonce}
      />
      <Tx 
        setBalance={setBalance} 
        address={address}
        privateKey={privateKey}
        nonce={nonce}
        setNonce={setNonce}
      />
    </div>
  );
}

export default App;
