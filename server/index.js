const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "004284bf5f4c49168d7e2b4557984906ade38b4026484ed876be4aa0f4b85557a72bf942ea3c5c22e4ceda965e8db43b38a8488d7968c72a4a3d19dda635bb1172e": 100,
  "0458d65966a323ddd3e585ac9f86ea34e71d1199c0427a186e5dd7ab0a1c307e4e77189be14d415d4d1c277f237b0f83d941d8abeff3ee30cb8fa92459b2823d39": 50,
  "04c7a4c5baa42d255d5c6ff610b064b350446095c634d6ed35474bfc47a70de5df251b1bd446c14d86f6e0e34f9b7dc4e256867813db781b18ab832d29611ca0b0": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side applciation
  // recover the public address from the signature = sender



  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
