"use client";
import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, type PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, Copy, Zap, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function Airdrop() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!publicKey || !connection) {
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey, "confirmed");
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalance(0);
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  const requestAirdrop = async () => {
    if (!publicKey || !connection) {
      toast("Wallet not connected yet", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const signature = await connection.requestAirdrop(
        publicKey as PublicKey,
        1000000000
      );
      await connection.confirmTransaction(signature, "confirmed");

      const lamports = await connection.getBalance(publicKey, "confirmed");
      setBalance(lamports / LAMPORTS_PER_SOL);

      toast("Airdrop Succesful", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast("Airdrop Failed", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!publicKey || !connection) return;

    setIsRefreshing(true);
    try {
      const lamports = await connection.getBalance(publicKey, "confirmed");
      setBalance(lamports / LAMPORTS_PER_SOL);
      toast("Balance Updated", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } catch (error) {
      console.log(error);
      toast("Refresh Failed", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyPublicKey = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast("Copied to clipboard", {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  const formatPublicKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6 text-purple-600" />
            Solana Wallet
          </CardTitle>
          <CardDescription>
            Connect your wallet to receive SOL airdrops
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={connected ? "default" : "secondary"}>
              {connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {connected && publicKey && (
            <>
              <div className="space-y-2">
                <span className="text-sm font-medium">Public Key:</span>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <code className="text-xs flex-1 font-mono">
                    {formatPublicKey(publicKey.toString())}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyPublicKey}
                    className="h-6 w-6 p-0 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Balance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SOL Balance:</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={refreshBalance}
                    disabled={isRefreshing}
                    className="h-6 w-6 p-0 cursor-pointer"
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
                <div className="text-2xl font-bold text-center py-4">
                  {balance}
                </div>
              </div>

              <Separator />

              <Button
                onClick={requestAirdrop}
                disabled={isLoading}
                className="w-full bg-gradient-to-r cursor-pointer from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing Airdrop...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Request 1 SOL Airdrop
                  </>
                )}
              </Button>
            </>
          )}

          {!connected && (
            <div className="text-center text-muted-foreground">
              <p className="text-sm">
                Please connect your wallet using the button above
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
