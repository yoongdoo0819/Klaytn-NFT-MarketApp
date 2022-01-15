pragma solidity >=0.4.24 <=0.5.6;

contract NFTSimple {

    string public name = "KlayLion";
    string public symbol = "KL";

    mapping (uint256 => address) public tokenOwner;
    mapping (uint256 => string) public tokenURIs;
    
    // 소유한 토큰 리스트
    mapping(address => uint256[]) private _ownedTokens;
    // onKIP17Received bytes value
    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;

    //  'to'에게 토큰 발행
    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public returns (bool) {
        
        tokenOwner[tokenId] = to;
        tokenURIs[tokenId] = tokenURI;

        _ownedTokens[to].push(tokenId);

        return true;
    }

    // 토큰 전송
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {

        require(from == msg.sender, "from != msg.sender");
        require(from == tokenOwner[tokenId], "you are not the owner of the token");

        _removeTokenFromList(from, tokenId);
        _ownedTokens[to].push(tokenId);

        tokenOwner[tokenId] = to;

        // 수신자가 스마트 컨트랙트라면, 코드 실행
        require(
            _checkOnKIP17Received(from, to, tokenId, _data), "KIP17: transfer to non KIP17Receiver implementer"
        );
    }

    function _checkOnKIP17Received(address from, address to, uint256 tokenId, bytes memory _data) internal returns (bool) {
        bool success;
        bytes memory returnData;

        // 스마트 컨트랙트인지 판별
        if (!isContract(to)) {
            return true;
        }

        // 스마트 컨트랙트가 맞다면, msg.sender, from, tokenId, _data를 파라미터로 하여
        // onKIP17Received(address operator, address from, uint256 tokenId, bytes memory data)를 호출
        // bytes4(keccak256("onKIP17Received(address,address,uint256,bytes)")) == _KIP17_RECEIVED
        (success, returnData) = to.call(
            abi.encodeWithSelector(
                _KIP17_RECEIVED,
                msg.sender,
                from,
                tokenId,
                _data
            )
        );

        if (
            returnData.length != 0 &&
            abi.decode(returnData, (bytes4)) == _KIP17_RECEIVED 
        ) {
            return true;
        }

        return false;
    }

    // account가 스마트 컨트랙트 주소인지 확인
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(account) }  // 스마트 컨트랙트라면, 코드의 사이즈가 0보다 클 것
        return size > 0;
    }

    // 사용자가 소유한 토큰 리스트 중 tokenId에 해당하는 토큰의 소유권 제거 
    function _removeTokenFromList(address from, uint256 tokenId) private {

        uint256 lastTokenIndex = _ownedTokens[from].length - 1;
        for(uint256 i=0; i<_ownedTokens[from].length; i++) {
            if (tokenId == _ownedTokens[from][i]) {
                _ownedTokens[from][i] = _ownedTokens[from][lastTokenIndex];
                break;
            }
        }
        _ownedTokens[from].length--;
    }

    // owner가 소유한 tokenId 리스트 반환
    function ownedToken(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    // uri 설정
    function setTokenUri(uint256 id, string memory uri) public {
        tokenURIs[id] = uri;
    }
}

contract NFTMarket {

    mapping(uint256 => address) public seller;

    function buyNFT(uint256 tokenId, address NFTAddress) public payable returns (bool) {
        // seller에게 0.01 KLAY 전송
        address payable receiver = address(uint160(seller[tokenId]));

        // 10 ** 18 PEB = 1 KLAY
        // 10 ** 16 PEB = 0.01 KLAY
        receiver.transfer(10 ** 16);

        NFTSimple(NFTAddress).safeTransferFrom(address(this), msg.sender, tokenId, '0x00');
        return true;
    }

    // Market 컨트랙트에서 토큰 수신 시, 판매자 address를 기록
    function onKIP17Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes4) {
        seller[tokenId] = from;
        return bytes4(keccak256("onKIP17Received(address,address,uint256,bytes)")); // _KIP17_RECEIVED (0x6745782b)
    }
}