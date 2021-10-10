import { generatePrivate, getPublic } from "@toruslabs/eccrypto"
// import readline from "readline"
import { generateRandomPolynomial, lagrangeInterpolation } from "@tkey/core"
import BN from "bn.js"
import ShareSerializationModule from "@tkey/share-serialization"
// import { promisify } from 'util';
import { clearTerminal, getLine } from "./utils"

export const generateKey = async function() {
    // generate key
    const privateKeyBuffer = generatePrivate()
    const PRIVATE_KEY_BN = new BN(privateKeyBuffer)
    // console.log('privkey', PRIVATE_KEY_BN)
    const shareIndexes = [new BN(1), new BN(2), new BN(3)]
    const poly = generateRandomPolynomial(1, PRIVATE_KEY_BN)

    const shareMap = poly.generateShares(shareIndexes)
    const shares = Object.values(shareMap).map(x => x.share)

    // turn into mnemonic
    const instance = new ShareSerializationModule()
    const share1Mnemonic = await instance.serialize(shareMap["1"].share, "mnemonic")
    console.log("share1Mnemonic", share1Mnemonic)
    console.log("press any key to continue")
    await getLine()
    clearTerminal()
    const share2Mnemonic = await instance.serialize(shareMap["2"].share, "mnemonic")
    console.log("share2Mnemonic", share2Mnemonic)
    console.log("press any key to continue")
    await getLine()
    clearTerminal()
    const share3Mnemonic = await instance.serialize(shareMap["3"].share, "mnemonic")
    console.log("share3Mnemonic", share3Mnemonic)
    console.log("press any key to continue")
    await getLine()
    clearTerminal()

    // recover from mneomnic
    const share1Recovered = await instance.deserialize(share1Mnemonic, "mnemonic")
    const share2Recovered = await instance.deserialize(share2Mnemonic, "mnemonic")
    const share3Recovered = await instance.deserialize(share3Mnemonic, "mnemonic")
    console.log("share1 mnemonic equal?", shareMap["1"].share.eq(share1Recovered))
    console.log("share2 mnemonic equal?", shareMap["2"].share.eq(share2Recovered))
    console.log("share3 mnemonic equal?", shareMap["3"].share.eq(share3Recovered))

    // reconstruct with 3
    const reconstructedKey = lagrangeInterpolation(shares, shareIndexes)
    // console.log('reconstructed key', reconstructedKey)
    console.log("equal?", reconstructedKey.eq(PRIVATE_KEY_BN))

    // reconstruct with 2
    const reconstructedKey2 = lagrangeInterpolation([shareMap["1"].share, shareMap["2"].share], [new BN(1), new BN(2)])
    // console.log("reconstructed key 2", reconstructedKey2)
    console.log("equal?", reconstructedKey2.eq(PRIVATE_KEY_BN))
    const reconstructedKey3 = lagrangeInterpolation([shareMap["2"].share, shareMap["3"].share], [new BN(2), new BN(3)])
    // console.log("reconstructed key 2", reconstructedKey3)
    console.log("equal?", reconstructedKey3.eq(PRIVATE_KEY_BN))
    const reconstructedKey4 = lagrangeInterpolation([shareMap["3"].share, shareMap["1"].share], [new BN(3), new BN(1)])
    // console.log("reconstructed key 2", reconstructedKey4)
    console.log("equal?", reconstructedKey4.eq(PRIVATE_KEY_BN))
    console.log("public key: ", getPublic(privateKeyBuffer).toString("hex"))
} 