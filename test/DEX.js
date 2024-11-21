const { expect } = require("chai");
const hre = require("hardhat");
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("DEX",() => {
        let tokenSupply = "1000000";
        let token,dex;
        let owner,kibo,rizki;
        let tokenPrice = hre.ethers.parseEther("0.00000000001");

    before(async()=>{
        [owner,kibo,rizki] = await hre.ethers.getSigners()
        const Token = await hre.ethers.getContractFactory("Token");
        token = await Token.deploy(tokenSupply);

        const DEX = await hre.ethers.getContractFactory("DEX");
        dex = await DEX.deploy(token.getAddress(),tokenPrice);
    });

    describe("Deployment",()=>{
        it("Should deploy without errors",async()=>{
            console.log("Token address: ",await token.getAddress());
            console.log("DEX address: ",await dex.getAddress());
            console.log("Owner address: ",owner.address);
            console.log("Kibo address: ",kibo.address);
            console.log("Rizki address: ",rizki.address);
        });
    });

    describe("Sell",()=>{
        it("Should fail if the account is not approved",async()=>{
            await expect(dex.sell()).to.be.reverted;
        });
        it("should allow DEX to transfer tokens",async()=>{
            await token.approve(dex.getAddress(),10000);
        });
        it("should not allow non-owner to call sell()",async()=>{
            await expect(dex.connect(kibo).sell()).to.be.reverted;
        });
        it("sell should transfer tokens from owner to dex",async()=>{
            await expect(dex.sell()).to.changeTokenBalances(token,[owner.address,await dex.getAddress()],[-10000,10000]);
        });
    });

    describe("Getters",()=>{ 
        it("should return correct token balance",async()=>{
            expect(await dex.getTokenBalance()).to.be.equal(10000);
        });
        it("should return correct price",async()=>{
            expect(await dex.getPrice(100)).to.be.equal(tokenPrice * BigInt(100));
        });
    });

    describe("Buy",()=>{ 
        it("Should allow user to buy token",async()=>{
            await expect(dex.connect(kibo).buy(100,{value: tokenPrice * BigInt(100)})).to.changeTokenBalances(token,[await dex.getAddress(), kibo.address],[-100,100]);

        });
        it("Should not allow user to buy token with invalid number of tokens",async()=>{
            await expect(dex.connect(kibo).buy(50000,{value: tokenPrice * BigInt(50000)})).to.be.reverted;
        });
        it("Should not allow user to buy token with invalid value",async()=>{
            await expect(dex.connect(kibo).buy(3000,{value: tokenPrice * BigInt(50000)})).to.be.reverted;
        });
    });

    describe("Withdraw tokens",()=>{ 
        it("should not allow non-owner withdraw tokens",async()=>{
            await expect(dex.connect(kibo).withdrawToken()).to.be.reverted;
        });
        it("should allow owner withdraw tokens",async()=>{
            await expect(dex.withdrawToken()).to.changeTokenBalances(token,[await dex.getAddress(),owner.address],[-9900,9900]);
        });
    });

    describe("Withdraw funds",()=>{ 
        it("should allow owner withdraw funds", async ()=>{
            await expect(dex.withdrawFunds()).to.changeEtherBalances([owner.address, await dex.getAddress()], [1000000000,-1000000000]);
        });
        it("should not allow non-owner withdraw funds", async ()=>{
            await expect(dex.connect(kibo).withdrawFunds()).to.be.reverted;
        });
    });


});
