const {verify, recoverPublickKey} = require("ethereum-cryptography/secp256k1")
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils")
const {sha256} = require("ethereum-cryptography/sha256")

class VerifyTransfer {

    constructor(sender, recipient, amount, signature, recoveryBit, nonce) {
        this.sender = sender
        this.recipient = recipient
        this.amount = amount
        this.signature = signature
        this.recoveryBit = recoveryBit
        this.nonce = nonce
        this.hash = this.toHash()
    }

    toHash(){
        return toHex(sha256(utf8ToBytes(this.sender + this.recipient + this.amount + this.nonce)))
    }

    verifyHash(hash) {
        return this.hash === hash
    }

    verifySignature(hash){
        return verify(this.signature, hash, this.sender)
    }

    verifySender(){
        const publicKey = recoverPublickKey(this.hash, this.signature, this.recoveryBit)

        return publicKey !== this.sender
    }
}

module.exports = VerifyTransfer;