const hre = require('hardhat');
const fs = require('fs/promises');

async function main() {
    const tokenPrice = hre.ethers.parseEther("0.00000000001");
    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy("21000000");

    const DEX = await hre.ethers.getContractFactory("DEX");
    const dex = await DEX.deploy(token.getAddress(), tokenPrice);

    console.log(token.interface.formatJson())

    await token.getDeployedCode();
    await dex.getDeployedCode();

    await writeDeploymentInfo(token, "token.json");
    await writeDeploymentInfo(dex, "dex.json");
}

async function writeDeploymentInfo(contract,filename = "") {
    const data = {
        Network: hre.network.name,
        Contract: {
            address: await contract.getAddress(),
            signerAddress: contract.runner.address,
            abi: contract.interface.formatJson(),
        }
    };

    const content = JSON.stringify(data,null,2);
    
    fs.writeFile(filename,content,{encoding: 'utf8'});
}

main().catch(err => {
    console.error(err);
    process.exit(1);
})