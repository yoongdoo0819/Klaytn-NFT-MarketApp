import React, {useState} from 'react';
import logo from './logo.svg';
import QRCode from 'qrcode.react';
import { getBalance, readNumber, setNumber } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './market.css';
import { Alert, Container } from "react-bootstrap";

const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x00";
function App() {
  const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

  const fetchNFTs = () => {
    
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
      
    </div>
  );
}

export default App;
