import BN from "bn.js";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";

export async function transferSolana(
  privKey: BN,
  toPubKeyBase58: string,
  amount: string,
  recentBlockhash: string
): Promise<string> {
  const edKey = getED25519Key(privKey.toString("hex", 64));
  const from = Keypair.fromSecretKey(edKey.sk);
  const to = new PublicKey(toPubKeyBase58);
  console.log("from public key: ", from.publicKey.toBase58());
  const transaction = new Transaction({  
    recentBlockhash,
  }).add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: LAMPORTS_PER_SOL * parseFloat(amount),
    })
  );
  transaction.sign(from);
  const rawTx = transaction.serialize({
    verifySignatures: true
  });
  return rawTx.toString("base64");
}
