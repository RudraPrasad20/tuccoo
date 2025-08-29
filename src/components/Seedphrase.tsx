"use client";

import { useState } from "react";
import { generateMnemonic, mnemonicToSeed } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { Keypair } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { derivePath } from "ed25519-hd-key";

export function GenerateSeed() {
  const [mnemonic, setMnemonic] = useState("");
  const [index, setIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(true);

  function GenerateMnemonic() {
    setIsGenerating(true);
    try {
      const res = generateMnemonic(wordlist, 128);
      setMnemonic(res);
      setIndex(0);
      setPublicKeys([]);
      setShowMnemonic(true);
      toast("Seed phrase generated");
    } finally {
      setIsGenerating(false);
    }
  }

  async function AddWallet() {
    if (!mnemonic) {
      toast("Generate a seed phrase first");
      return;
    }
    try {
      setIsAdding(true);
      const currentIndex = index;
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const { key } = derivePath(path, seed.toString());

      // key is 32 bytes → expand to full keypair
      const keypair = Keypair.fromSeed(key);
      setIndex((i) => i + 1);
      setPublicKeys((prev) => [...prev, keypair.publicKey.toBase58()]);
      toast("Wallet derived");
    } catch (e) {
      console.error(e);
      toast("Failed to derive wallet");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Seed & Derive Wallets</CardTitle>
        <CardDescription>
          Creates a BIP39 seed and derives Solana keypairs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={GenerateMnemonic}
            disabled={isGenerating}
            className="cursor-pointer"
          >
            {isGenerating ? "Generating..." : "Generate Seedphrase"}
          </Button>
          <Button
            onClick={AddWallet}
            variant="secondary"
            disabled={!mnemonic || isAdding}
            className="cursor-pointer"
          >
            {isAdding ? "Adding..." : "Add Wallet"}
          </Button>
        </div>

        {mnemonic && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Mnemonic (secret):
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(mnemonic);
                      toast("Seed phrase copied");
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 cursor-pointer"
                    onClick={() => setShowMnemonic((s) => !s)}
                  >
                    {showMnemonic ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
              <pre className="p-3 rounded-md bg-muted text-sm leading-relaxed whitespace-pre-wrap break-words">
                {showMnemonic
                  ? mnemonic
                  : "•••••••• •••••••• •••••••• •••••••• •••••••• •••••••• •••••••• •••••••• •••••••• •••••••• ••••••••"}
              </pre>
            </div>
          </>
        )}

        {publicKeys.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Derived Public Keys</div>
              <div className="space-y-2">
                {publicKeys.map((p) => (
                  <div
                    key={p}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <span className="text-xs font-mono">{p}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(p);
                        toast("Copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
