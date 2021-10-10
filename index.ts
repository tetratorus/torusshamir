import { askQuestion, askYNQuestion, clearTerminal } from "./utils";
import { generateKey } from "./generate";
import { reconstructKey } from "./reconstruct";
import BN from "bn.js";
import { subkey } from "@toruslabs/openlogin-subkey";
import { transferSolana } from "./solana";
import { getPublic } from "@toruslabs/eccrypto";

async function main() {
  try {
    // generate key

    const toGenerateKey = await askYNQuestion(
      "Would you like to generate a key y/n ? "
    );
    if (toGenerateKey === "y") {
      await generateKey();
    }

    // reconstruct key
    const specifyPubKey = await askYNQuestion("Would you like to specify a pubkey for validation y/n ? ")
    let pubkey = "0432206d3d1f71771816e5aee84d78a6ee69cd521566024f4a354961d302e073403207deb7c93104325ce6d62b658d933967b39d90feb15ce7f0e60c91466d52d0" // HARDCODED
    if (specifyPubKey === "y") {
      pubkey = await askQuestion("Please specify pubkey in hex")
    }
    console.log("expected pub key is ", pubkey)
    let key = await reconstructKey(pubkey);

    console.log("split key pubkey: ", getPublic(Buffer.from(key.toString(16,64), "hex")).toString("hex"))

    // use subkey
    const toUseSubKey = await askYNQuestion(
      "Would you like to use a subkey y/n ? "
    );
    if (toUseSubKey === "y") {
      const derivationPath = await askQuestion(
        "Please enter the derivation path: "
      );
      const subKeyHex = subkey(
        key.toString(16, 64),
        Buffer.from(derivationPath, "utf-8")
      );
      key = new BN(subKeyHex, 16);
    }

    console.log("pubkey in use: ", getPublic(Buffer.from(key.toString(16,64), "hex")).toString("hex"))

    const action = await askQuestion(`
Enter one of the following options:
(1) Transfer Solana
(2) Transfer Ethereum
`);
    if (action === "1") {
      const pubKeyBase58 = await askQuestion(
        "Enter the public key to transfer to in base58: "
      );
      const amount = await askQuestion("Enter the amount to transfer in SOL: ");
      const recentBlockhash = await askQuestion("Enter a recent blockhash: ");
      const signedSolanaTx = await transferSolana(key, pubKeyBase58, amount, recentBlockhash);
      console.log("signed solana tx: ", signedSolanaTx);
    } else if (action === "2") {
    } else {
      console.log("not a valid option, exiting");
      process.exit(1);
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
  }
}

main();
