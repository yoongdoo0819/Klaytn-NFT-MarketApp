import Caver from 'caver-js'; // webpack5 이슈 발생 시, webpack@4.44.2 / react-scripts@4.0.3로 다운그레이드 적용하면 해결 
import StorageABI from '../abi/StorageABI.json';
import {STORAGE_CONTRACT_ADDRESS, CHAIN_ID} from '../constants';

// 다음은 Klaytn API Service 사용을 위해 발급 받은 인증 정보
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
const StorageContract = new caver.contract(StorageABI, STORAGE_CONTRACT_ADDRESS); // 실행할 컨트랙트의 인터페이스와 주소

//  Storage 컨트랙트의 retrieve 함수 실행 (조회만 하므로 개인키 필요 없음)
export const readNumber = async () => {
  const num = await StorageContract.methods.retrieve().call();
  console.log(num)
}

//  사용자가 보유한 KLAY 양 확인 
export const getBalance = (address) => {
  
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
    console.log(balance);
    return balance;
  })
}

//  Storage 컨트랙트의 store 함수 실행 (write 작업이 요구되므로 함수 실행 호출자의 개인키 필요)
export const setNumber = async (newNumber) => {
  
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