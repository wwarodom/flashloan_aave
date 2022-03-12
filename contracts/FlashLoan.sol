// SPDX-License-Identifier: NoLicense

pragma solidity ^0.6.6;

import "./FlashLoanReceiverBase.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./ILendingPool.sol";

contract FlashloanV1 is FlashLoanReceiverBaseV1 { 
    
    function getContractBalance() public view returns(uint){
        return address(this).balance;
    }
 
    function getAssetBalanceInContract(address _asset) public view returns(uint){
        ERC20 asset = ERC20(_asset);
        return asset.balanceOf(address(this));
    }

    constructor(address _addressProvider) FlashLoanReceiverBaseV1(_addressProvider) public{}

 function flashloan(address _asset) public onlyOwner {
        bytes memory data = "";
        uint amount = 10000 ether;  //amount of lending addess (DAI)
 
        IERC20(_asset).approve(addressesProvider.getLendingPool(), 900000000000000000000000 );

        ILendingPoolV1 lendingPool = ILendingPoolV1(addressesProvider.getLendingPool());
        lendingPool.flashLoan(address(this), _asset, amount, data);
    }

    /**
  This function is called after your contract has received the flash loaned amount
     */
    function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    )
        external
        override
    {
        require(_amount <= getBalanceInternal(address(this), _reserve), "Invalid balance, was the flashLoan successful?");
       //
        // Your logic goes here.
        // !! Ensure that *this contract* has enough of `_reserve` funds to payback the `_fee` !!
        //

        uint totalDebt = _amount.add(_fee);
        transferFundsBackToPoolInternal(_reserve, totalDebt);
    }

}
