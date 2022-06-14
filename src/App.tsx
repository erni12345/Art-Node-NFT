import "./App.css";
import { Metaplex } from "@metaplex-foundation/js-next";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import React from "react";
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { FC, useMemo, useState, useCallback } from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import CaseOpening from "./CaseOpening.tsx";
require("@solana/wallet-adapter-react-ui/styles.css");

const App: FC = () => {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="App">
            <div className="container">
              <div className="welcomeText">
                <div className="tile_holder">
                  <h1 className="title">NFT Exploit Art Case Opening!</h1>
                </div>
                <div>
                  <p>1. Connect Your Wallet of choice</p>
                  <p>2. Press on the Open button</p>
                  <p>3. Try to win a prize!</p>
                </div>
              </div>
              <div className="buttonParent">
                <div className="buttons">
                  <WalletMultiButton />
                  <CaseOpening />
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
