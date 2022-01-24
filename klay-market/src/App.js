import React, {useState} from 'react';
import logo from './logo.svg';
import QRCode from 'qrcode.react';
import { getBalance, readNumber, setNumber } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import './App.css';

const DEFAULT_QR_CODE = 'DEFAULT';
function App() {
  const [balance, setBalance] = useState("0");
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

  //readNumber();
  //getBalance('0x860ab241a263ee4445d6ee2cb6cc5c9d2d5cbcff');

  const onClickgetAddress = () => {
    KlipAPI.getAddress(setQrvalue);
  };
  const onClicksetNumber = () => {
    KlipAPI.setNumber(2000, setQrvalue);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button
          onClick={() => {
            onClickgetAddress();
          }}
        >
          주소 가져오기
        </button>
        <button
          onClick={() => {
            onClicksetNumber();
          }}
        >
          number 변경
        </button>
        <br></br>
        <br></br>
        <QRCode value={qrvalue} />
        <p>{balance}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
