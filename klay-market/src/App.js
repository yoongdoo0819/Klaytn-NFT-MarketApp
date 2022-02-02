import React, {useState} from 'react';
import logo from './logo.svg';
import QRCode from 'qrcode.react';
import { getBalance, readNumber, setNumber } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import './App.css';

const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x00";
function App() {
  const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

  //readNumber();
  //getBalance('0x860ab241a263ee4445d6ee2cb6cc5c9d2d5cbcff');
  
  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
    });
  }

  const onClickgetAddress = () => {
    KlipAPI.getAddress(setQrvalue);
  };
  const onClicksetNumber = () => {
    KlipAPI.setNumber(2000, setQrvalue);
  };

  return (
    <div className="App">
      <div onClick={getUserData}>
        잔고 : {myBalance}
        주소 : {myAddress}
      </div>
      <QRCode value={qrvalue} />
    </div>
  );
}

export default App;
