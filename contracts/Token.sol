// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{

    constructor(uint256 initialSupply) ERC20("Kibo","MRAF"){
        _mint(msg.sender, initialSupply);
    }
    
}