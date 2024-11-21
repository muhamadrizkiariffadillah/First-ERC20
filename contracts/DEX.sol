// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX{
    IERC20 public associatedToken;

    uint256 price;
    address owner;

    constructor(IERC20 _token, uint256 _price){
        associatedToken = _token;
        owner = msg.sender;
        price = _price;
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"you are not the owner");
        _;
    }

    function sell() external
    onlyOwner
    {
        uint256 allowance = associatedToken.allowance(msg.sender,address(this));
        require(allowance > 0,"you must allow this contract access to at least one token");
        bool send = associatedToken.transferFrom(msg.sender, address(this), allowance);
        require(send,"failed to send");
    }

    function withdrawToken() external
    onlyOwner
    {
        uint256 balance = associatedToken.balanceOf(address(this));
        bool send =  associatedToken.transfer(msg.sender,balance);
        require(send,"transfer failed");
    }

    function withdrawFunds() external
    onlyOwner
    {
        (bool send,) = payable(msg.sender).call{value: address(this).balance}("");
        require(send,"call failed");    
    }
    
    function getPrice(uint256 _numToken) public view returns(uint256){
        return _numToken * price;
    }

    function buy(uint256 _numToken) external payable{
        require(_numToken <=  getTokenBalance(),"not enough tokens");
        
        uint _price = getPrice(_numToken);

        require(msg.value == _price, "invalid value sent");
    
        bool send = associatedToken.transfer(msg.sender,_numToken);

        require(send,"transfer failed");

    }

    function getTokenBalance() public view returns(uint256){
        return associatedToken.balanceOf(address(this));
    }

}