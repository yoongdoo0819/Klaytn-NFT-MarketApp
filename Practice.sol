pragma solidity >=0.4.24 <=0.5.6;

contract Practice {

    string public name = "KlayLion";
    string public symbol = "KL";

    mapping (uint256 => address) public tokenOwner;
    mapping (uint256 => string) public tokenURIs;
    
    // 소유한 토큰 리스트
    mapping(address => uint256[]) private _ownedTokens;

    // mint(tokenId, uri, owner)
    // transferFrom(from, to, tokenId)
    
    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public returns (bool) {
        //  'to'에게 tokenId를 발행
        tokenOwner[tokenId] = to;
        tokenURIs[tokenId] = tokenURI;

        _ownedTokens[to].push(tokenId);

        return true;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {

        require(from == msg.sender, "from != msg.sender");
        require(from == tokenOwner[tokenId], "you are not the owner of the token");

        _removeTokenFromList(from, tokenId);
        _ownedTokens[to].push(tokenId);

        tokenOwner[tokenId] = to;
    }

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

    function ownedToken(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function setTokenUri(uint256 id, string memory uri) public {
        tokenURIs[id] = uri;
    }
}