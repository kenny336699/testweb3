// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
//0x5FbDB2315678afecb367f032d93F642f64180aa3
async function main() {
  const crowdfunding = await hre.ethers.deployContract("CrowdFunding");

  await crowdfunding.waitForDeployment();

  console.log(`crowdfunding deployed to ${crowdfunding.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
