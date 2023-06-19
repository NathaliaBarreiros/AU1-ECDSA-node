import { getHexPublicKey } from "./PublicKeyUtils";
import {signSync} from "ethereum-cryptography/secp256k1"
import { toHex, utf8ToBytes} from "ethereum-cryptography/utils"
import {sha256} from "ethereum-cryptography/sha256"

class Transfer {
    constructor(sender, recipient, amount, nonce){
        this.sender = sender
        this.recipient = recipient
        this.amount = amount
        this.nonce = nonce
        this.hash = this.toHash()
    }

    toHash(){
        return toHex(sha256(utf8ToBytes(this.sender + this.recipient + this.amount + this.nonce)))
    }

    signTx(privateKey) {
        const hexAddress = getHexPublicKey(privateKey)
        if(hexAddress !== this.sender){
            throw new Error('Unable to sign transactions for other wallets.')
        }

        const [ sig, recoveryBit] = signSync(this.hash, privateKey, {recovered: true})
        this.signature = toHex(sig)
        this.recoveryBit = Number(recoveryBit)
    }
}

export default Transfer;