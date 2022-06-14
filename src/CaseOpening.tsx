import "./App.css";
import { Metaplex } from "@metaplex-foundation/js-next";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import React from "react";
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";

import { FC, useMemo, useState, useCallback } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  transferInstructionData,
} from "@solana/spl-token";

require("@solana/wallet-adapter-react-ui/styles.css");

const win = (amount) => {
  return <p>Congrats u won {`${amount}`} DUST$</p>;
};

const lost = () => {
  return <p>Sorry you didnt win anything</p>;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const CaseOpening: FC = () => {
  const [address, setAddress] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const mx = Metaplex.make(connection);
  const whiteList = new Set();
  const [winVal, setWinVal] = useState(0);
  whiteList.add(
    new PublicKey("AhRrSeRLvSAeipXcCKGzYvRMQraHPnNME6QxiwYJzA1a").toBase58()
  );
  whiteList.add(
    new PublicKey("F9fpnv2Y4BbEWxo9oTSqNQSPRRk8Xdq4Yo7Jv1eGEj3C").toBase58()
  );

  const w100 = [4728, 3165, 12, 1609, 2460];
  const w50 = [1626, 1972, 1534, 167, 3363, 2878, 4651, 1079];
  const w25 = [
    1284, 3789, 4164, 426, 838, 4567, 4240, 874, 4829, 30, 806, 2251,
  ];
  const w10 = [
    259, 2103, 321, 1324, 3686, 3055, 4337, 4378, 3199, 230, 3439, 68, 4621,
    3310, 3810,
  ];
  const w2 = [
    972, 3493, 4558, 1575, 2475, 4197, 4319, 4148, 1890, 2949, 2495, 2721, 1274,
    869, 4001, 3607, 127, 1481, 1710, 1868, 3949, 348, 1243, 4820, 1407,
  ];

  const checkIfWin = (number) => {
    if (w100.includes(number)) {
      return 100;
    }
    if (w50.includes(number)) {
      return 50;
    }
    if (w25.includes(number)) {
      return 25;
    }
    if (w10.includes(number)) {
      return 10;
    }
    if (w2.includes(number)) {
      return 2;
    }
    return 1;
  };

  const what_page = () => {
    if (winVal == 0) return;
    if (winVal == 1) {
      return lost();
    } else {
      return (
        <p style={{ fontWeight: "bold" }}>Congrats u won {winVal} DUST$</p>
      );
    }
  };

  const burnNFT = async (nftKey) => {
    let ata = await getAssociatedTokenAddress(
      nftKey, // mint
      new PublicKey("J74RFYiPh7Sm5imfbQzHeBzwTPSsSPj3eFep2VsvE3Uw"), // owner
      false // allow owner off curve
    );

    console.log(`ata: ${ata.toBase58()}`);
    if (!publicKey) throw new WalletNotConnectedError();

    let ata2 = await getAssociatedTokenAddress(
      nftKey, // mint
      publicKey, // owner
      false // allow owner off curve
    );
    console.log(`ata: ${ata2.toBase58()}`);

    let tx = new Transaction();
    tx.add(createTransferInstruction(ata2, ata, publicKey, 1));

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, "processed");
    console.log(`Transaction work ${signature}`);
    setLoaded(true);
    setAddress(nftKey);
  };

  const checkIfNFTOwned = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    let foundGood = false;
    setLoaded(false);
    const nft_list = await mx.nfts().findNftsByOwner(publicKey);
    if (nft_list.length == 0) {
      alert("Sorry, it seems you do not have the white listed nft");
      return;
    }
    console.log(nft_list);
    for (let i = 0; i < nft_list.length; i++) {
      let mint = nft_list[i].mint;
      if (whiteList.has(mint.toBase58())) {
        console.log(`here is the mint : ${mint}`);
        console.log("Found good token");

        foundGood = true;
        setWinVal(checkIfWin(1575));
        await burnNFT(mint);
        break;
      }
    }

    if (!foundGood) {
      alert("Sorry it seems you dont have a white Listed NFT");
    }
  }, [publicKey, sendTransaction, connection]);

  return (
    <div>
      <button onClick={checkIfNFTOwned}>Open Case -1 NFT</button>
      {loaded && <div>{what_page()}</div>}
    </div>
  );
};

export default CaseOpening;
