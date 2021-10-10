import BN from "bn.js";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmRawTransaction,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { askQuestion } from "./utils";

export async function transferSolana(tx: string): Promise<string> {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const str = await connection.sendEncodedTransaction(
    tx
  );
  console.log(str, "hash");
  return str;
}

transferSolana(
  "ATE8AZu1QTFGOEBkCJbbwwuNBgv77lPs+x+1m6baIpAIs6PewB+UjPyqyxzYjr7SoaeTHpwZ0Jd7hXXRR2SI9gQBAAEDZnC+b4u9B1yIam7jmLKOZHSQa766stjkUzkFZBN9qSci1XS0f13jiSJ67ulDHTnWA9D4I2UxyhYUjmEt4jd/AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+MrEBhOtZgv2TgFPJCJZvlgp4DWJ2Mam6TqzNW8F9IBAgIAAQwCAAAAgJaYAAAAAAA="
);
