import { ethers } from "hardhat";
import { ERC20__factory, FlashloanV1 } from "../typechain";

// FlashloanV1__factory
const LENDING_POOL_ADDRESS = "0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5";
const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";

async function main() {
  const FlashLoan = await ethers.getContractFactory("FlashloanV1");
  const flashloan: FlashloanV1 = (await FlashLoan.deploy(LENDING_POOL_ADDRESS)) as FlashloanV1;

  const [deployer] = await ethers.getSigners();
  const dai = ERC20__factory.connect(DAI_ADDRESS, deployer);

  console.log("Flashloan deployed to:", flashloan.address);
  console.log(
    "Balance deployer's dai: " + (await dai.balanceOf(deployer.address))
  );

  // Transfer ETH from deployer to Flashloan contract
  const tx = await deployer.sendTransaction({
    to: flashloan.address,
    value: ethers.utils.parseEther("0.02"),
  });
  await tx.wait();
  console.log(
    "Balance ETH in Flashloan contract: " +
      (await flashloan.getContractBalance())
  );

  // You can get DAI from https://staging.aave.com/#/faucet
  // Choose AAVEv2 Market with small circle K on top in Kovan net
  // Click at DAI to receive token amount
  // Transfer DAI from deployer to Flashloan contract

  const tx1 = await dai
    .connect(deployer)
    .transfer(flashloan.address, ethers.utils.parseEther("36")); // DAI fee 0.35% from lending amount inf flashloan()
  await tx1.wait();
  console.log(
    "Balance contract's dai: ",
    +(await dai.balanceOf(flashloan.address))
  );
  console.log(
    "Account deployer ETH balance:",
    (await deployer.getBalance()).toString()
  );

  // Execute Flashloan
  const tx2 = await flashloan.flashloan(DAI_ADDRESS, {
    gasLimit: 3000000,
    gasPrice: 3000000000,
  });
  await tx2.wait();
  console.log("Flashloan: " + tx2.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
