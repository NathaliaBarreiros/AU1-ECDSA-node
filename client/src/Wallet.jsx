import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import { getHexPublicKey } from "./classes/PublicKeyUtils";

import { toHex } from 'ethereum-cryptography/utils'

function Wallet({
  privateKey,
  setPrivateKey,
  address,
  setAddress,
  balance,
  setBalance,
  walletError,
  setWalletError,
  nonce,
  setNonce }) {
  async function onChange(evt) {
    setPrivateKey(evt.target.value);

    let validPrivateKey = secp.utils.isValidPrivateKey(evt.target.value)

    if(validPrivateKey){
      const hexAddress = getHexPublicKey(evt.target.value)
      setAddress(hexAddress)

      if(hexAddress){
        const {
          data: {balance, nonce}
        } = await server.get(`balance/${hexAddress}`)
        setBalance(balance)
        setNonce(nonce)
      } else {
        setBalance(0)
      }
      setWalletError("")
    } else {
      setAddress("")
      setWalletError("Invalid Private Key")
    }

  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
          Wallet Private Key
        <input placeholder="Type in a private key: " value={privateKey} onChange={onChange}></input>
      </label>
      {walletError && <div className="error">Wallet Error: {walletError}</div>}

      {address ? 
        [
          <div className="address">Address: {address.slice(0,20)}...</div>,
          // <div className="address"> 
          // Transaction #: {nonce}</div>
        ] 
        : null
      }

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
