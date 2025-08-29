import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Airdrop } from "./components/Airdrop";
import { SendTransaction } from "./components/Transaction";
import { GenerateSeed } from "./components/Seedphrase";

const endpoint =
  process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

export default function Page() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <main className="min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-pretty">TUCCOO</h1>
                <WalletMultiButton />
              </div>
            </header>

            <section className="container mx-auto px-4 py-8">
              <Tabs defaultValue="airdrop" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
                  <TabsTrigger value="airdrop" className="cursor-pointer">
                    Airdrop
                  </TabsTrigger>
                  <TabsTrigger value="send" className=" cursor-pointer">
                    Send SOL
                  </TabsTrigger>
                  <TabsTrigger value="seed" className=" cursor-pointer">
                    Generate
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="airdrop">
                    <div className="space-y-6">
                      <Airdrop />
                    </div>
                  </TabsContent>

                  <TabsContent value="send">
                    <SendTransaction />
                  
                  </TabsContent>
                  <TabsContent value="seed">
                    <GenerateSeed />
                  </TabsContent>
                </div>
              </Tabs>
            </section>
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
