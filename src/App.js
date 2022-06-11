import "./App.css";
import { Metaplex } from "@metaplex-foundation/js-next";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useState } from "react";
import React from 'react';
import WheelComponent from 'react-wheel-of-prizes'


const connection = new Connection(clusterApiUrl("mainnet-beta"));
const mx = Metaplex.make(connection);
const whiteList = new Set()
whiteList.add(new PublicKey("AhRrSeRLvSAeipXcCKGzYvRMQraHPnNME6QxiwYJzA1a").toBase58())
function App() {
  const [address, setAddress] = useState(
    "3ijFZcJKmp1EnDbbuaumWYvEFbztx9NRupwTXTchK9bP"
  );
 
  
  const [loaded, setLoaded] = useState(false);
  const [nfts, setNfts] = useState([]);
    
  const fetchNft = async () => {
    setLoaded(false);

    const nft_list = await mx.nfts().findNftsByOwner(new PublicKey("6xWMqnZPd54fXvn9Qt1HRNsPQybDWrDXksSEaWLv7LhK"));
    nft_list.forEach(nft => {
      let mint = nft.mint;
      if (whiteList.has(mint.toBase58())){
        console.log(`here is the mint : ${mint}`);
        console.log("Found good token");
        setLoaded(true);
      }
    });
    
  };

  const segments = [
    '0 Sol',
    '0.1 Sol',
    '0 Sol',
    '0.1 Sol',
    '10 Sol',
    '1 Sol',
    '0 Sol',
    '1 Sol'
  ]
  const segColors = [
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#FF9000'
  ]
  const onFinished = (winner) => {
    console.log(winner)
  }




  return (
    <div className="App">
      <div className="container">
        <h1 className="title">NFT Mint Address</h1>
        <div className="nftForm">
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <button onClick={fetchNft}>Fetch</button>
        </div>
        {loaded && (
          
          <div>
            <WheelComponent
              segments={segments}
              segColors={segColors}
              onFinished={(winner) => onFinished(winner)}
              primaryColor='black'
              contrastColor='white'
              buttonText='Spin'
              isOnlyOnce={false}
              size={290}
              upDuration={1000}
              downDuration={1000}
              fontFamily='Arial'
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
