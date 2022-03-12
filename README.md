# AAVE Lending Pool Flashloan example

## Get DAI before doing flashloan
* You can get DAI from https://staging.aave.com/#/faucet
* Choose AAVEv2 Market with small circle K on top in KovanNet
* Click at DAI to receive token amount

## Transfer DAI to the contract
* Transfer DAI from deployer to Flashloan contract
* DAI fee 0.35% from lending amount inf flashloan()

## Deploy the contract
npx hardhat run scripts/deploy.ts --network kovan 

* Before deploy the contract, don't forget to setup .env

Credit: 
https://github.com/PavanAnanthSharma/Aave-FlashLoan-using-solidity 