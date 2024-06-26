// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12 <0.9.0;

contract MyToken {

    // public variables here
 string public TokenName;
 string public TokenAbbrv;
 uint public TotalSupply;
 
 
    // mapping variable here
mapping(address=>uint) public balances;

constructor(string memory _tokenName, string memory _tokenAbbrv,uint _totalSupply ){
    TokenName=_tokenName;
    TokenAbbrv=_tokenAbbrv;
    TotalSupply=_totalSupply;
     balances[msg.sender]=TotalSupply;
}

    // mint function
function Mint(address to, uint value) external {
 require(to!=address(0),"You are minting to Zero address");
 balances[to]+=value; 
 TotalSupply +=value;

}
    // burn function
function burn(address from, uint value) external{
    require(from!=address(0),"You are burning from Zero address");
    require(balances[from]>value ,"Insufficient balance to burn");
    balances[from]-=value;
    TotalSupply -=value;

}    

}
