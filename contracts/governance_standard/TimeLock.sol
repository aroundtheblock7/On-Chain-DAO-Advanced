// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// We want to wait for a new vote to be executed and this contract allow for that duration
// I.e. maybe a proposal goes out that says anyone who owns the Governance token has to pay 5 tokens...
// ..if you don't wnant to be a part of this you can get out.
// TimeLock.sol here gives users time to get out if they don't like a governance update.
// So once a proposal passes it won't go into effect right away, there will be some duration before it goes into effect

import "@openzeppelin/contracts/governance/TimelockController.sol";

// Remember this TimeLock contract is what owns the Box.sol contract (not the Governor Contract)
// In order for Governance to happen, it has to flow through the Timelock contract
// The GovernorContract is where we send our votes.

//TimeLockController's constructor takes minDelay, proposers, and exeuctors so we must pass them in here
contract TimeLock is TimelockController {
    //minDelay: How long you have to wait until exectuting
    //proposers: The list of addresses that can propose
    //executors: Who can execute when a proposal passes
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors) {}
}
