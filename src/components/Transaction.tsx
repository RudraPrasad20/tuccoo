"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SendTransaction() {
  const { publicKey, sendTransaction } = useWallet();
  const [toKey, setToKey] = useState("");
  const [amount, setAmount] = useState("");
  const { connection } = useConnection();

  async function send() {
    if (!publicKey) {
      toast("Wallet not connected", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }
    if (!toKey || !amount) {
      toast("Fill all fields", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const tr = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(toKey),
          lamports: LAMPORTS_PER_SOL * parseFloat(amount),
        })
      );

      const sig = await sendTransaction(tr, connection); // wallet adapter
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
      console.log("Transaction sent:", sig);
      alert(`Sent! Tx Sig: ${sig}`);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send SOL</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="toKey">Recipient public key</Label>
          <Input
            id="toKey"
            placeholder="Enter recipient public key"
            value={toKey}
            onChange={(e) => setToKey(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (SOL)</Label>
          <Input
            id="amount"
            placeholder="Enter amount in SOL"
            type="number"
            min="0.1"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <Button onClick={send} className="w-full cursor-pointer">
          Send SOL
        </Button>
      </CardContent>
    </Card>
  );
}
