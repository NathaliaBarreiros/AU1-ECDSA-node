import { getPublicKey, utils } from "ethereum-cryptography/secp256k1"
import {toHex} from "ethereum-cryptography/utils"

export function getHexPublicKey(privateKey){
    const hexAddress = toHex(getPublicKey(privateKey))

    return hexAddress
}