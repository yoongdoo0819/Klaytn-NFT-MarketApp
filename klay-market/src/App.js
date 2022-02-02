import React, {useState} from 'react';
import logo from './logo.svg';
import QRCode from 'qrcode.react';
import { getBalance, readNumber, setNumber, fetchCardsOf } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './market.css';
import { Alert, Container, Card, Nav, Form, Button } from "react-bootstrap";
import { NFT_MARKET_CONTRACT_ADDRESS } from './constants';

const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x00";
function App() {
  const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState("MINT");
  const [mintImageUrl, setMintImageUrl] = useState("");

  // NFT mint 기능
  const onClickMint = async (uri) => {
    if (myAddress === DEFAULT_ADDRESS) alert('NO ADDRESS');
    const randomTokenId = parseInt(Math.random() * 1000000);
    KlipAPI.mintCardWithURI(myAddress, randomTokenId, uri, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    });
  };

  // NFT Market 컨트랙트에서 호출자의 NFT 조회
  const fetchMarketNFTs = async () => {
    const _nfts = await fetchCardsOf(NFT_MARKET_CONTRACT_ADDRESS);    
    setNfts(_nfts);
  }

  // NFT 컨트랙트에서 호출자의 NFT 조회
  const fetchMyNFTs = async () => {
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

      {/* 사용자 주소, 클레이 금액 및 NFT 조회 */}
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
        
        {/* 갤러리(마켓 및 사용자 지갑) */}
        {tab == "MARKET" || tab == "WALLET" ? (
          <div className="container" style={{padding:0, width:"100%"}}>
          {nfts.map((nft, index) => (
            <Card.Img className="img-responsive" src={nfts[index].uri} />
          ))}
          </div>
        ) : null}

        {/* 발행 페이지 */}
        {tab == "MINT" ? (
          <div className="container" style={{padding:0, width:"100%"}}> 
            <Card className="text-center" 
                  style={{ color: "black", height: "500", borderColor: "#C5B358" }}
            >
              <Card.Body style={{ opacity: 0.9, backgroundColor: "black" }}>
                {mintImageUrl !== "" ? (
                  <Card.Img src={mintImageUrl} height={"50%"} />
                ) : null}
                <Form>
                  <Form.Group>
                    <Form.Control
                    value={mintImageUrl}
                    onChange={(e)=> {
                      console.log(e.target.value);
                      setMintImageUrl(e.target.value);
                    }}
                    type="text"
                    placeholder="이미지 주소를 입력해주세요"
                    />
                  </Form.Group>
                  <br />
                  <Button
                    onClick={()=>{onClickMint(mintImageUrl)}}
                    variant="primary" 
                    style={{
                        backgroundColor:"#910000", 
                        borderColor:"#910000"
                      }}
                    >
                      발행하기
                  </Button>
                </Form>
              </Card.Body>
            </Card>
        </div>
         ) : null}
      </div>
      <br />

      {/* QR코드 및 NFT 조회 버튼*/}
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
      <button onClick={ fetchMyNFTs }>
        NFT 가져오기
      </button>

      {/* 탭 */}
      <nav 
        style={{backgroundColor: "gray", height: 75}} 
        className="navbar fixed-bottom navbar-light" 
        role="navigation"
      >
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            <div 
              onClick={()=>{
                setTab("MARKET");
                fetchMarketNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>MARKET</div>
            </div>

            <div 
              onClick={()=>{
                setTab("MINT");
                fetchMarketNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>MINT</div>
            </div>

            <div 
              onClick={()=>{
                setTab("WALLET");
                fetchMarketNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>WALLET</div>
            </div>
          </div>

        </Nav>
      </nav>
    </div>
  );
}

export default App;
