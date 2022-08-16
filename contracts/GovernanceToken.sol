// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

// To avoid users bulking up on a tokens after someone makes a proposal we want to take a snapshot of the tokens people have at a certain block...
//...by doing this, we're taking a snapshot of tokens in the “past” so users can not bulk up deliberetly after a proposal is announced...
//...to assist with this we want to change from inheriting an ERC20 token to an an ERC20Votes contract....
//... we also want to add the ERC20Permit
contract GovernanceToken is ERC20Votes {
    uint256 public s_maxSupply = 1000000000000000000;

    constructor()
        ERC20("GovernanceToken", "GT")
        ERC20Permit("GovernanceToken")
    {
        _mint(msg.sender, s_maxSupply);
    }

    //When adding in functions we need to remember to override them as they are in ERC20 or ERC20Permit.

    //Anytime we makes transfers we want to call this  _afterTokenTransfer function below as it ensures that the "snapshots" are updated....
    //...we want to make sure we know how many people have how many tokens at each block.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }
}
