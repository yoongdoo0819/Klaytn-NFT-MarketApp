# Klaytn-NFT-MarketApp
NFT 블록체인 마켓 앱 만들기 with 그라운드X 2기

## Prerequisites
- Node : 14.18.3
- webpack: 4.44.2
- react-scripts: 4.0.3

## 주요 기능 및 특징
- Klaytn API Service 사용
- Klip 지갑 주소 불러오기 : Klip API
- KLAY 잔고 조회 : caver.js (getBalance)
- NFT 조회 : (사용자 & 마켓) : caver.js (NFT 컨트랙트의 balanceOf/tokenOfOwnerByIndex/tokenURI)
- NFT 발행 : Klip API
- NFT 판매 (사용자의 NFT를 마켓에 등록) : Klip API
- NFT 구매 (마켓에 등록되어 있는 NFT 구매) : Klip API
- Klip API 사용 시 브라우저 QR코드 이용
