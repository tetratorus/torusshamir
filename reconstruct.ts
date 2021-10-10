import { askQuestion, clearTerminal } from "./utils";
import BN from "bn.js";
import { lagrangeInterpolation } from "@tkey/core";
import ShareSerializationModule from "@tkey/share-serialization";
import { getPublic } from "@toruslabs/eccrypto";

export async function reconstructKey(expectedPubKey: string): Promise<BN> {
  if (expectedPubKey === "") {
    console.log("pub key not specified, not validating pub key");
  }
  const instance = new ShareSerializationModule();
  const share1Mnemonic = await askQuestion("please enter share1 mnemonic: ");
  const share1 = await instance.deserialize(share1Mnemonic, "mnemonic");
  clearTerminal();

  const share2Mnemonic = await askQuestion("please enter share2 menmonic: ");
  const share2 = await instance.deserialize(share2Mnemonic, "mnemonic");
  clearTerminal();

  const share3Mnemonic = await askQuestion("please enter share3 mnemonic: ");
  const share3 = await instance.deserialize(share3Mnemonic, "mnemonic");
  clearTerminal();

  console.log("trying to reconstruct...");

  let key: BN = new BN(0);

  if (expectedPubKey) {
    const key1 = lagrangeInterpolation(
      [share1, share2],
      [new BN(1), new BN(2)]
    );
    const key1Pub = getPublic(
      Buffer.from(key1.toString(16, 64), "hex")
    ).toString("hex");
    if (key1Pub !== expectedPubKey) {
      console.log(
        "share1 and share2 generated ",
        key1Pub,
        "which doesn't equal expectedPubKey",
        expectedPubKey
      );
      key = key1;
    }
    const key2 = lagrangeInterpolation(
      [share2, share3],
      [new BN(2), new BN(3)]
    );
    const key2Pub = getPublic(
      Buffer.from(key2.toString(16, 64), "hex")
    ).toString("hex");
    if (key2Pub !== expectedPubKey) {
      console.log(
        "share2 and share3 generated ",
        key2Pub,
        "which doesn't equal expectedPubKey",
        expectedPubKey
      );
      key = key2;
    }
    const key3 = lagrangeInterpolation(
      [share1, share3],
      [new BN(1), new BN(3)]
    );
    const key3Pub = getPublic(
      Buffer.from(key3.toString(16, 64), "hex")
    ).toString("hex");
    if (key3Pub !== expectedPubKey) {
      console.log(
        "share1 and share3 generated ",
        key3Pub,
        "which doesn't equal expectedPubKey",
        expectedPubKey
      );
      key = key3;
    }

    if (key.eq(new BN(0))) {
      throw new Error("shares were unable to reconstruct the key");
    } else {
      return key;
    }
  } else {
    const key1 = lagrangeInterpolation(
      [share1, share2],
      [new BN(1), new BN(2)]
    );
    const key2 = lagrangeInterpolation(
      [share2, share3],
      [new BN(2), new BN(3)]
    );
    const key3 = lagrangeInterpolation(
      [share1, share3],
      [new BN(1), new BN(3)]
    );
    if (!key1.eq(key2) || !key1.eq(key3)) {
      throw new Error(
        "shares need to be all consistent if pubkey is not specified, and shares were not all consistent"
      );
    }
    return key1;
  }
}
