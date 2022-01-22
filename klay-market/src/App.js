import logo from './logo.svg';
import './App.css';
import Caver from 'caver-js'; // webpack5 이슈 발생 시, webpack@4.44.2 / react-scripts@4.0.3로 다운그레이드 적용하면 해결 
 
//  const CONTRACT_ADDRESS = '';
//  const ACCESS_KEY_ID = '';
//  const SECRET_ACCESS_KEY = '';
const CHAIN_ID = '1001'; // MainNet : 8217 , TestNet : 1001
const option = {
  headers : [
      {
        name: "Authorization",
        value: "Basic " + 'S0FTS0NSUEY0RFM1SzRMWExNSjgzSDdBOlB6Njg5dFVIWUhGc0JGMHVWRmQtcllnclZZR2NTMzRwdTgyQVdvRno='
      },
      {name: "x-chain-id", value: CHAIN_ID}
  ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
const getBalance = (address) => {
  
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
    console.log(balance);
    return balance;
  })
}

function App() {
  getBalance('0x860ab241a263ee4445d6ee2cb6cc5c9d2d5cbcff');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Klaytn <code>src/App.js</code> and save to reload.
        </p>
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
