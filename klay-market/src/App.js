import React, {useState} from 'react';
import logo from './logo.svg';
import QRCode from 'qrcode.react';
import { getBalance, readNumber, setNumber, fetchCardsOf } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './market.css';
import { Alert, Container, Card } from "react-bootstrap";
import { NFT_MARKET_CONTRACT_ADDRESS } from './constants';

const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x00";
function App() {
  const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);


  // NFT Market 컨트랙트에서 호출자의 NFT 조회
  const fethMarketNFTs = async () => {
    const _nfts = await fetchCardsOf(NFT_MARKET_CONTRACT_ADDRESS);    
    setNfts(_nfts);
  }

  // NFT 컨트랙트에서 호출자의 NFT 조회
  const fethMyNFTs = async () => {
    const _nfts = await fetchCardsOf(myAddress);    
    setNfts(_nfts);
  }

  // Klip API 사용하여 사용자 데이터 조회
  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
    });
  }

  return (
    <div className="App">
      <div style={{ backgroundColor: "gray", padding: 10}}>
        <div 
            style={{
              fontSize: 30,
              fontHeight: "bold",
              paddingLeft: 5,
              marginTop: 10,
            }}
          >
            My Wallet
        </div>
        {myAddress}
        <br />
        <Alert 
          onClick={getUserData}
          variant={"balance"} 
          style={{backgroundColor:"aliceblue", fontSize: 25, color: "black"}}
        >
          {myBalance}
        </Alert>
        <br />
        
      </div>
      <div className="container" style={{padding:0, width:"100%"}}>
        {nfts.map((nft, index) => (
          <Card.Img className="img-responsive" src={nfts[index].uri} />
        ))}
      </div>
      <br />
      <Container 
        style={{ 
          backgroundColor: "white", 
          width:300, 
          height:300, 
          padding: 20,
          }}
      >
        <QRCode value={qrvalue} size={256} style={{ margin: "auto" }} />
      </Container>
      <button onClick={ fethMyNFTs }>
        NFT query
      </button>
    </div>
  );
}

export default App;
