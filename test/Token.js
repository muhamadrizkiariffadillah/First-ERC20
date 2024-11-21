const { expect } = require("chai");
const { hre, ethers } = require("hardhat");

describe("Token",() =>{
    let tokenSupply = "1000000000000000000000000";
    let token;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async ()=>{
        [owner, addr1, addr2] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(tokenSupply); 
    });

    describe("Deployment",() => {
        it("should assign total supply of tokens to the owner/deployer",async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(String(await token.totalSupply())).to.equal(ownerBalance);
        });

    });

    describe("Transaction",()=>{
        it("Should transfer between accounts",async()=>{
            await token.transfer(addr1.address,100);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(await token.balanceOf(addr1.address)).to.equal(addr1Balance);    
        });
        it("Should failed transfer between accounts because not enough",async()=>{
            await expect(token.connect(addr1).transfer(addr2.address,51)).to.be.reverted;
        })

    });
})
