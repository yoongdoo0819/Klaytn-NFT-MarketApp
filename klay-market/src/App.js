import logo from './logo.svg';
import './App.css';
import Caver from 'caver-js'; // webpack5 이슈 발생 시, webpack@4.44.2 / react-scripts@4.0.3로 다운그레이드 적용하면 해결 


const STORAGE_CONTRACT_ADDRESS = '0x84F3AE708621c706ba5D273DeE679b92376631c6';  // 테스트넷에 배포된 컨트랙트 (Storage.sol) 주소
const STORAGE_ABI = '[ { "inputs": [], "name": "retrieve", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "num", "type": "uint256" } ], "name": "store", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]'

// 다음은 Klaytn API Service 사용을 위해 발급 받은 인증 정보
const ACCESS_KEY_ID = '';
const SECRET_ACCESS_KEY = '';
const CHAIN_ID = '1001'; // MainNet : 8217 , TestNet : 1001
const option = {
  headers : [
      {
        name: "Authorization",
        value: "Basic " + 'S0FTS0NSUEY0RFM1SzRMWExNSjgzSDdBOlB6Njg5dFVIWUhGc0JGMHVWRmQtcllnclZZR2NTMzRwdTgyQVdvRno='  // "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64") 와 동일
      },
      {name: "x-chain-id", value: CHAIN_ID}
  ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
const StorageContract = new caver.contract(JSON.parse(STORAGE_ABI), STORAGE_CONTRACT_ADDRESS);

const readNumber = async () => {
  const num = await StorageContract.methods.retrieve().call();
  console.log(num)
}

const getBalance = (address) => {
  
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
    console.log(balance);
    return balance;
  })
}

const setNumber = async (newNumber) => {
  
  try {
    // 사용할 account 설정
    const privatekey = '직접 입력';
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);

    // 스마트 컨트랙트 실행 트랜잭션 전송
    const receipt = await StorageContract.methods.store(newNumber).send({
      from : deployer.address, // address
      gas : "0x4bfd200"
    })
    
    // 결과 확인
    console.log(receipt);
  } catch(e) {
    console.log(`[ERROR_SET_NUMBER]${e}`);
  }
  
}

function App() {
  readNumber();
  getBalance('0x860ab241a263ee4445d6ee2cb6cc5c9d2d5cbcff');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button title={'카운트 변경'} onClick={()=>{setNumber(100)}} />
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
