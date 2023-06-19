import { useState } from "react";
import server from "./server";
import Transfer from "./classes/Transfer";


function Tx({ address, setBalance, privateKey, nonce, setNonce }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    let transferAmount = new Transfer(address, recipient, parseInt(sendAmount), nonce)
    transferAmount.signTx(privateKey)

    let data = {...transferAmount}

    try {
      const {
        data: { balance, nonce },
      } = await server.post(`send`, 
        data
      );
      setBalance(balance);
      setNonce(nonce)

    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Tx;
