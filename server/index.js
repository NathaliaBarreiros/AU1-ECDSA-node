const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const VerifyTransfer = require("./scripts/VerifyTransfer");
const { sign } = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  // privateKey1: 689799cfef9fcabd3b2ca66d188afd6333e8f29b37f1b976d0c1312e002ae24c
  "0444601a974e3fc67090210f53ee530f66be5c4e07b87abd96b13a7d7559b8b77c2569ecc326cbe52dc5c5715ef52a1b036c7149eaeeb7dee301507af846006cb4": 100,
  // privateKey2: fd6a4589a48a90f337c8eb1d992f36c1f2443f6c690e4ea7d294d195a62157ba
  "04c9dd0553b4b913f5b0738fcf9d3dd7fa1fe7c5801d1b87ef8e48019cad688f51ba395579a5d539933c06975d53b58c1e463a38eaafc4c1187a09526b1fc75456": 50,
  // privateKey3: f9c03907070f0eb430df88be0df1b4958f18cf0a16ae3a4832119b07873098b5
  "048aceebc64092c91a52937d25fa6683965e52ef7ceb66acf1deed6d2b817468431aec88e3f439d2fc3cba8f9a916e3f4032c6268d55042d90daa32686797304ef": 75,
};

// nonces
const nonces = {
  "0444601a974e3fc67090210f53ee530f66be5c4e07b87abd96b13a7d7559b8b77c2569ecc326cbe52dc5c5715ef52a1b036c7149eaeeb7dee301507af846006cb4": 0,
  "04c9dd0553b4b913f5b0738fcf9d3dd7fa1fe7c5801d1b87ef8e48019cad688f51ba395579a5d539933c06975d53b58c1e463a38eaafc4c1187a09526b1fc75456": 0,
  "048aceebc64092c91a52937d25fa6683965e52ef7ceb66acf1deed6d2b817468431aec88e3f439d2fc3cba8f9a916e3f4032c6268d55042d90daa32686797304ef": 0,
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const nonce = nonces[address] || 0
  res.send({ balance, nonce });
});

app.post("/send", (req, res) => {

  const { sender, recipient, amount, signature, hash, recoveryBit, nonce } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const verifyTransfer = new VerifyTransfer(sender, recipient, amount, signature, recoveryBit, nonce)

  let verifyHash = verifyTransfer.verifyHash(hash)
  if(!verifyHash) {
    res.status(400).send({message: `Invalid Hash. Expected: ${verifyTransfer.hash} but got: ${hash}`})
  }

  let verifySignature = verifyTransfer.verifySignature(hash)
  if(!verifySignature){
    res.status(400).send({message: "Invalid Signature."})
  }

  if (nonce !== nonces[verifyTransfer.sender]){
    res.status(400).send({message: `Invalid Nonce. Replay attack. Expected: ${nonces[verifyTransfer.sender]} but got: ${nonce}`})
  }



  if (balances[verifyTransfer.sender] < verifyTransfer.amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[verifyTransfer.sender] -= verifyTransfer.amount;
    balances[verifyTransfer.recipient] += verifyTransfer.amount;
    nonces[verifyTransfer.sender] += 1;

    res.send({ balance: balances[sender], nonce: nonces[verifyTransfer.sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
